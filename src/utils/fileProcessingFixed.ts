import Papa from 'papaparse';
import Tesseract from 'tesseract.js';

// Subject-wise data structure
export interface SubjectScore {
  subjectName: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  status: 'FAILING' | 'AT_RISK' | 'PASSING';
}

export interface ParsedStudentData {
  name: string;
  studentId?: string;
  subjects: SubjectScore[];
  overallPercentage: number;
  extractedText?: string;
}

// Common subject mappings
const SUBJECT_KEYWORDS: { [key: string]: string } = {
  'math': 'Mathematics',
  'maths': 'Mathematics',
  'mathematics': 'Mathematics',
  'science': 'Science',
  'sci': 'Science',
  'english': 'English',
  'eng': 'English',
  'hindi': 'Hindi',
  'hin': 'Hindi',
  'social': 'Social Studies',
  'sst': 'Social Studies',
  'history': 'History',
  'hist': 'History',
  'geography': 'Geography',
  'geo': 'Geography',
  'physics': 'Physics',
  'phy': 'Physics',
  'chemistry': 'Chemistry',
  'chem': 'Chemistry',
  'biology': 'Biology',
  'bio': 'Biology',
  'computer': 'Computer Science',
  'cs': 'Computer Science',
  'it': 'Computer Science',
  'economics': 'Economics',
  'eco': 'Economics',
  'commerce': 'Commerce',
  'accounts': 'Accountancy',
  'pe': 'Physical Education',
  'sports': 'Physical Education',
};

// Calculate grade based on percentage
const getGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 40) return 'E';
  return 'F';
};

// Get status based on percentage
const getStatus = (percentage: number): 'FAILING' | 'AT_RISK' | 'PASSING' => {
  if (percentage < 40) return 'FAILING';
  if (percentage < 50) return 'AT_RISK';
  return 'PASSING';
};

// Normalize subject name
const normalizeSubjectName = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  for (const [key, value] of Object.entries(SUBJECT_KEYWORDS)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  // Capitalize first letter of each word
  return name.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

/**
 * Process CSV file
 */
export const processCSVFile = (file: File): Promise<ParsedStudentData | null> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          console.log('CSV Parsed:', results.data);
          
          if (!results.data || results.data.length === 0) {
            resolve(null);
            return;
          }

          const firstRow = results.data[0] as any;
          const subjects: SubjectScore[] = [];
          
          // Extract name and ID
          const name = firstRow.name || firstRow.Name || firstRow.student_name || 'Student';
          const studentId = firstRow.student_id || firstRow.id || firstRow.roll_no || '';
          
          // Find all subject columns (skip name, id, etc.)
          const skipColumns = ['name', 'student_id', 'id', 'roll_no', 'class', 'section'];
          
          Object.keys(firstRow).forEach((key) => {
            if (skipColumns.includes(key.toLowerCase())) return;
            
            const value = firstRow[key];
            const score = parseFloat(value);
            
            if (!isNaN(score) && score >= 0 && score <= 100) {
              const subjectName = normalizeSubjectName(key);
              const percentage = score;
              
              subjects.push({
                subjectName,
                score,
                maxScore: 100,
                percentage,
                grade: getGrade(percentage),
                status: getStatus(percentage)
              });
            }
          });
          
          if (subjects.length === 0) {
            console.error('No valid subjects found in CSV');
            resolve(null);
            return;
          }
          
          const totalPercentage = subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length;
          
          resolve({
            name,
            studentId,
            subjects,
            overallPercentage: totalPercentage
          });
        } catch (error) {
          console.error('CSV processing error:', error);
          resolve(null);
        }
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        resolve(null);
      }
    });
  });
};

/**
 * Process Image file with OCR
 */
export const processImageFile = async (file: File): Promise<ParsedStudentData | null> => {
  try {
    console.log('Starting OCR processing...');
    
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const text = result.data.text;
    console.log('OCR Extracted Text:', text);
    
    return extractSubjectsFromText(text);
  } catch (error) {
    console.error('Image OCR error:', error);
    return null;
  }
};

/**
 * Process PDF file with OCR
 */
export const processPDFFile = async (file: File): Promise<ParsedStudentData | null> => {
  try {
    console.log('Processing PDF with OCR...');
    
    // Convert PDF first page to image for OCR
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`PDF OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const text = result.data.text;
    console.log('PDF OCR Extracted Text:', text);
    
    return extractSubjectsFromText(text);
  } catch (error) {
    console.error('PDF processing error:', error);
    return null;
  }
};

/**
 * Extract subject data from OCR text
 */
const extractSubjectsFromText = (text: string): ParsedStudentData | null => {
  const subjects: SubjectScore[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  console.log('Processing', lines.length, 'lines');
  
  let studentName = 'Student';
  
  // Try to find student name (usually in first few lines)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.toLowerCase().includes('name') && lines[i + 1]) {
      studentName = lines[i + 1];
      break;
    }
  }
  
  // Pattern 1: "Mathematics 85" or "Maths: 85" or "Math - 85"
  const pattern1 = /([a-zA-Z\s]+?)[\s:.-]+(\d{2,3})/g;
  
  const matches = [...text.matchAll(pattern1)];
  console.log('Found', matches.length, 'potential subject-score pairs');
  
  matches.forEach(match => {
    const subjectRaw = match[1].trim();
    const scoreStr = match[2];
    
    // Skip if subject name is too short or too long
    if (subjectRaw.length < 3 || subjectRaw.length > 30) return;
    
    const score = parseInt(scoreStr);
    
    // Valid score range
    if (score < 0 || score > 100) return;
    
    // Try to identify as a known subject
    const subjectName = normalizeSubjectName(subjectRaw);
    
    // Check if already added
    if (subjects.find(s => s.subjectName === subjectName)) return;
    
    // Check if subject name contains common subject keywords
    const subjectLower = subjectRaw.toLowerCase();
    const isValidSubject = Object.keys(SUBJECT_KEYWORDS).some(keyword => 
      subjectLower.includes(keyword)
    );
    
    if (!isValidSubject && subjectRaw.split(' ').length > 4) {
      // Skip if not a known subject and name is too long
      return;
    }
    
    const percentage = score;
    
    subjects.push({
      subjectName,
      score,
      maxScore: 100,
      percentage,
      grade: getGrade(percentage),
      status: getStatus(percentage)
    });
  });
  
  // If we found subjects, return data
  if (subjects.length > 0) {
    const totalPercentage = subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length;
    
    return {
      name: studentName,
      subjects,
      overallPercentage: totalPercentage,
      extractedText: text.substring(0, 500) // First 500 chars for debugging
    };
  }
  
  // Pattern 2: Table format
  // Try to find rows with subject and score
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const words = line.split(/\s+/);
    
    // Look for lines with 2-5 words where last word is a number
    if (words.length >= 2 && words.length <= 5) {
      const lastWord = words[words.length - 1];
      const score = parseInt(lastWord);
      
      if (!isNaN(score) && score >= 0 && score <= 100) {
        const subjectWords = words.slice(0, -1).join(' ');
        const subjectName = normalizeSubjectName(subjectWords);
        
        // Check if already added
        if (subjects.find(s => s.subjectName === subjectName)) continue;
        
        const percentage = score;
        
        subjects.push({
          subjectName,
          score,
          maxScore: 100,
          percentage,
          grade: getGrade(percentage),
          status: getStatus(percentage)
        });
      }
    }
  }
  
  if (subjects.length > 0) {
    const totalPercentage = subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length;
    
    return {
      name: studentName,
      subjects,
      overallPercentage: totalPercentage,
      extractedText: text.substring(0, 500)
    };
  }
  
  console.error('Could not extract subject data from text');
  return null;
};

/**
 * Main function to process any file type
 */
export const processMarksheetFile = async (file: File): Promise<ParsedStudentData | null> => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  console.log('Processing file:', fileName, 'Type:', fileType);
  
  if (fileType.includes('csv') || fileName.endsWith('.csv')) {
    return processCSVFile(file);
  } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
    return processPDFFile(file);
  } else if (fileType.includes('image') || fileName.match(/\.(jpg|jpeg|png|gif|bmp)$/)) {
    return processImageFile(file);
  } else {
    console.error('Unsupported file type:', fileType);
    return null;
  }
};
