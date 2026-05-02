import Papa from 'papaparse';
import Tesseract from 'tesseract.js';

// Subject-wise data structure
export interface SubjectScore {
  subjectName: string;
  score: number;
  maxScore: number;
  grade?: string;
}

// Enhanced student data with subjects
export interface EnhancedStudentData {
  name: string;
  studentId: string;
  rollNumber?: string;
  class?: string;
  subjects: SubjectScore[];
  attendance?: number;
  totalMarks?: number;
  percentage?: number;
  extractedText?: string; // For debugging
}

// List of common subject names to look for
const COMMON_SUBJECTS = [
  'mathematics', 'math', 'maths',
  'science', 'general science',
  'english', 'english language', 'english literature',
  'social studies', 'social science', 'sst',
  'hindi', 'hindi language',
  'physics',
  'chemistry',
  'biology', 'bio',
  'computer science', 'computer', 'cs', 'it',
  'history',
  'geography', 'geo',
  'economics', 'eco',
  'physical education', 'pe', 'sports',
  'art', 'drawing',
  'music',
  'sanskrit'
];

/**
 * Extract subject scores from text using intelligent pattern matching
 */
export const extractSubjectsFromText = (text: string): SubjectScore[] => {
  const subjects: SubjectScore[] = [];
  const lines = text.split('\n');
  
  console.log('Extracting subjects from text:', text.substring(0, 200));
  
  // Pattern 1: "Subject Name: 85/100" or "Subject Name 85 100"
  const pattern1 = /([a-zA-Z\s]+)[\s:]+(\d+)[\s/]+(\d+)/g;
  let matches = [...text.matchAll(pattern1)];
  
  matches.forEach(match => {
    const subjectName = match[1].trim().toLowerCase();
    const score = parseInt(match[2]);
    const maxScore = parseInt(match[3]);
    
    // Check if this is a valid subject
    if (isValidSubject(subjectName) && score <= maxScore && maxScore >= 50 && maxScore <= 200) {
      subjects.push({
        subjectName: capitalizeSubject(subjectName),
        score,
        maxScore,
        grade: calculateGrade(score, maxScore)
      });
    }
  });
  
  // Pattern 2: Lines with "Subject    Score"
  // Mathematics    85
  // English        78
  lines.forEach((line) => {
    const words = line.trim().split(/\s+/);
    if (words.length >= 2) {
      const lastWord = words[words.length - 1];
      const score = parseInt(lastWord);
      
      if (!isNaN(score) && score >= 0 && score <= 100) {
        const subjectWords = words.slice(0, -1).join(' ').toLowerCase();
        
        if (isValidSubject(subjectWords)) {
          // Check if not already added
          if (!subjects.find(s => s.subjectName.toLowerCase() === subjectWords)) {
            subjects.push({
              subjectName: capitalizeSubject(subjectWords),
              score,
              maxScore: 100, // Assume 100 if not specified
              grade: calculateGrade(score, 100)
            });
          }
        }
      }
    }
  });
  
  // Pattern 3: Table-like structure
  // Subject | Marks | Grade
  // Math    | 85    | A
  const tablePattern = /([a-zA-Z\s]+)\s*[|\t]\s*(\d+)\s*[|\t]/g;
  matches = [...text.matchAll(tablePattern)];
  
  matches.forEach(match => {
    const subjectName = match[1].trim().toLowerCase();
    const score = parseInt(match[2]);
    
    if (isValidSubject(subjectName) && score >= 0 && score <= 100) {
      if (!subjects.find(s => s.subjectName.toLowerCase() === subjectName)) {
        subjects.push({
          subjectName: capitalizeSubject(subjectName),
          score,
          maxScore: 100,
          grade: calculateGrade(score, 100)
        });
      }
    }
  });
  
  console.log('Extracted subjects:', subjects);
  return subjects;
};

/**
 * Check if a text is likely a valid subject name
 */
const isValidSubject = (text: string): boolean => {
  const cleanText = text.toLowerCase().trim();
  
  // Must be at least 3 characters
  if (cleanText.length < 3) return false;
  
  // Check against known subjects
  return COMMON_SUBJECTS.some(subject => 
    cleanText.includes(subject) || subject.includes(cleanText)
  );
};

/**
 * Capitalize subject name properly
 */
const capitalizeSubject = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Calculate grade based on percentage
 */
const calculateGrade = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

/**
 * Extract attendance from text
 */
const extractAttendance = (text: string): number | undefined => {
  const patterns = [
    /attendance[\s:]+(\d+(?:\.\d+)?)\s*%?/i,
    /present[\s:]+(\d+)[\s/]+(\d+)/i,
    /(\d+)\s*%\s*attendance/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (value > 0 && value <= 100) {
        return value;
      }
    }
  }
  
  return undefined;
};

/**
 * Extract student name from text
 */
const extractStudentName = (text: string): string => {
  const patterns = [
    /name[\s:]+([a-zA-Z\s]+)/i,
    /student[\s:]+([a-zA-Z\s]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const name = match[1].trim();
      // Name should be 3-50 characters and only letters/spaces
      if (name.length >= 3 && name.length <= 50 && /^[a-zA-Z\s]+$/.test(name)) {
        return name;
      }
    }
  }
  
  return 'Student';
};

/**
 * Extract student ID from text
 */
const extractStudentId = (text: string): string => {
  const patterns = [
    /(?:student\s*)?id[\s:]+([a-zA-Z0-9]+)/i,
    /roll[\s:]+([a-zA-Z0-9]+)/i,
    /registration[\s:]+([a-zA-Z0-9]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return `STU${Math.floor(Math.random() * 100000)}`;
};

/**
 * Extract text from image using Tesseract OCR with better configuration
 */
export const extractTextFromImageEnhanced = async (file: File): Promise<string> => {
  try {
    console.log('Starting OCR processing...');
    
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    
    console.log('OCR completed. Confidence:', result.data.confidence);
    console.log('Extracted text preview:', result.data.text.substring(0, 300));
    
    return result.data.text;
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to extract text from image: ' + (error as Error).message);
  }
};

/**
 * Extract text from PDF with better parsing
 */
export const extractTextFromPDFEnhanced = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert PDF bytes to readable text
        let text = '';
        let currentWord = '';
        
        for (let i = 0; i < uint8Array.length; i++) {
          const byte = uint8Array[i];
          
          // Printable ASCII characters
          if (byte >= 32 && byte <= 126) {
            const char = String.fromCharCode(byte);
            currentWord += char;
          } else if (currentWord.length > 0) {
            // Word boundary
            if (currentWord.length > 1) {
              text += currentWord + ' ';
            }
            currentWord = '';
            
            // Newline characters
            if (byte === 10 || byte === 13) {
              text += '\n';
            }
          }
        }
        
        console.log('PDF text extracted:', text.substring(0, 300));
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to extract text from PDF: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parse CSV file with subject data
 */
export const parseCSVWithSubjects = (file: File): Promise<EnhancedStudentData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const students: EnhancedStudentData[] = [];
          
          results.data.forEach((row: any) => {
            const subjects: SubjectScore[] = [];
            let name = row.name || row.student_name || 'Unknown';
            let studentId = row.student_id || row.id || row.roll_number || '';
            
            // Extract subject scores from columns
            Object.keys(row).forEach(key => {
              const lowerKey = key.toLowerCase();
              
              // Check if this column is a subject
              if (isValidSubject(lowerKey) && row[key]) {
                const score = parseFloat(row[key]);
                if (!isNaN(score) && score >= 0 && score <= 100) {
                  subjects.push({
                    subjectName: capitalizeSubject(lowerKey),
                    score,
                    maxScore: 100,
                    grade: calculateGrade(score, 100)
                  });
                }
              }
              
              // Check for subject_score pattern (e.g., math_score, english_score)
              if (lowerKey.includes('_score') || lowerKey.includes('_marks')) {
                const subjectName = lowerKey.replace('_score', '').replace('_marks', '');
                if (isValidSubject(subjectName) && row[key]) {
                  const score = parseFloat(row[key]);
                  if (!isNaN(score) && score >= 0 && score <= 100) {
                    subjects.push({
                      subjectName: capitalizeSubject(subjectName),
                      score,
                      maxScore: 100,
                      grade: calculateGrade(score, 100)
                    });
                  }
                }
              }
            });
            
            if (subjects.length > 0) {
              const totalMarks = subjects.reduce((sum, s) => sum + s.score, 0);
              const percentage = subjects.length > 0 ? totalMarks / subjects.length : 0;
              
              students.push({
                name,
                studentId,
                subjects,
                attendance: row.attendance ? parseFloat(row.attendance) : undefined,
                totalMarks,
                percentage
              });
            }
          });
          
          console.log('Parsed CSV students:', students);
          resolve(students);
        } catch (error) {
          reject(new Error('Failed to process CSV: ' + (error as Error).message));
        }
      },
      error: (error) => {
        reject(new Error('Failed to parse CSV: ' + error.message));
      }
    });
  });
};

/**
 * Main function to process uploaded file and extract subject data
 */
export const processMarksheetFile = async (file: File): Promise<EnhancedStudentData> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  console.log('Processing file:', file.name, 'Type:', fileExtension);
  
  let extractedText = '';
  
  try {
    // Extract text based on file type
    if (fileExtension === 'csv') {
      const students = await parseCSVWithSubjects(file);
      if (students.length > 0) {
        return students[0]; // Return first student for single upload
      }
      throw new Error('No valid data found in CSV');
    } else if (fileExtension === 'pdf') {
      extractedText = await extractTextFromPDFEnhanced(file);
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension || '')) {
      extractedText = await extractTextFromImageEnhanced(file);
    } else {
      throw new Error('Unsupported file type. Please upload CSV, PDF, or image files.');
    }
    
    // Extract subject data from text
    const subjects = extractSubjectsFromText(extractedText);
    
    if (subjects.length === 0) {
      throw new Error('No subjects found in the document. Please ensure the marksheet is clear and readable.');
    }
    
    // Extract other details
    const name = extractStudentName(extractedText);
    const studentId = extractStudentId(extractedText);
    const attendance = extractAttendance(extractedText);
    
    const totalMarks = subjects.reduce((sum, s) => sum + s.score, 0);
    const percentage = subjects.length > 0 
      ? (subjects.reduce((sum, s) => sum + (s.score / s.maxScore * 100), 0) / subjects.length)
      : 0;
    
    return {
      name,
      studentId,
      subjects,
      attendance,
      totalMarks,
      percentage,
      extractedText: extractedText.substring(0, 500) // Store first 500 chars for debugging
    };
  } catch (error) {
    console.error('File processing error:', error);
    throw error;
  }
};

/**
 * Identify failing and at-risk subjects
 */
export interface SubjectAnalysis {
  failingSubjects: SubjectScore[];
  atRiskSubjects: SubjectScore[];
  passingSubjects: SubjectScore[];
  overallPercentage: number;
  recommendations: string[];
}

export const analyzeSubjectPerformance = (subjects: SubjectScore[]): SubjectAnalysis => {
  const failingSubjects: SubjectScore[] = [];
  const atRiskSubjects: SubjectScore[] = [];
  const passingSubjects: SubjectScore[] = [];
  
  subjects.forEach(subject => {
    const percentage = (subject.score / subject.maxScore) * 100;
    
    if (percentage < 40) {
      failingSubjects.push(subject);
    } else if (percentage >= 40 && percentage < 50) {
      atRiskSubjects.push(subject);
    } else {
      passingSubjects.push(subject);
    }
  });
  
  const overallPercentage = subjects.length > 0
    ? subjects.reduce((sum, s) => sum + (s.score / s.maxScore * 100), 0) / subjects.length
    : 0;
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (failingSubjects.length > 0) {
    recommendations.push(`🚨 Critical: Focus immediately on ${failingSubjects.map(s => s.subjectName).join(', ')}`);
    failingSubjects.forEach(subject => {
      recommendations.push(`• ${subject.subjectName}: Attend extra classes, seek teacher help, practice daily`);
    });
  }
  
  if (atRiskSubjects.length > 0) {
    recommendations.push(`⚠️ Warning: Need improvement in ${atRiskSubjects.map(s => s.subjectName).join(', ')}`);
    atRiskSubjects.forEach(subject => {
      recommendations.push(`• ${subject.subjectName}: Increase study time by 1-2 hours daily`);
    });
  }
  
  if (passingSubjects.length > 0 && failingSubjects.length === 0) {
    recommendations.push(`✅ Good performance! Keep up the consistent effort.`);
  }
  
  if (overallPercentage < 50) {
    recommendations.push('📚 Overall: Need significant improvement across all subjects');
    recommendations.push('💡 Suggestion: Create a study schedule, join study groups, take regular tests');
  }
  
  return {
    failingSubjects,
    atRiskSubjects,
    passingSubjects,
    overallPercentage,
    recommendations
  };
};
