import Papa from 'papaparse';
import Tesseract from 'tesseract.js';

// Interface for CSV row data
interface CSVStudentRow {
  name?: string;
  email?: string;
  student_id?: string;
  attendance?: string | number;
  assignment_score?: string | number;
  quiz_score?: string | number;
  midterm_score?: string | number;
  previous_result?: string | number;
  study_hours?: string | number;
  study_hours_per_day?: string | number;
  extracurricular?: string | number;
  extracurricular_activities?: string | number;
}

// Interface for processed student data
export interface ProcessedStudentData {
  name: string;
  email: string;
  studentId: string;
  attendance: number;
  assignmentScore: number;
  quizScore: number;
  midtermScore: number;
  previousResult: number;
  studyHoursPerDay: number;
  extracurricularActivities: number;
}

/**
 * Parse CSV file and extract student data
 */
export const parseCSVFile = (file: File): Promise<ProcessedStudentData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const processedData = results.data.map((row: any) => {
            const csvRow = row as CSVStudentRow;
            
            return {
              name: csvRow.name || csvRow.student_id || 'Unknown',
              email: csvRow.email || `student${Math.random().toString(36).substr(2, 9)}@school.com`,
              studentId: csvRow.student_id || `STU${Math.floor(Math.random() * 10000)}`,
              attendance: parseFloat(String(csvRow.attendance || '0')) || 0,
              assignmentScore: parseFloat(String(csvRow.assignment_score || '0')) || 0,
              quizScore: parseFloat(String(csvRow.quiz_score || '0')) || 0,
              midtermScore: parseFloat(String(csvRow.midterm_score || '0')) || 0,
              previousResult: parseFloat(String(csvRow.previous_result || '0')) || 0,
              studyHoursPerDay: parseFloat(String(csvRow.study_hours_per_day || csvRow.study_hours || '0')) || 0,
              extracurricularActivities: parseInt(String(csvRow.extracurricular_activities || csvRow.extracurricular || '0')) || 0,
            };
          });

          resolve(processedData.filter(data => data.attendance > 0 || data.assignmentScore > 0));
        } catch (error) {
          reject(new Error('Failed to process CSV data: ' + (error as Error).message));
        }
      },
      error: (error) => {
        reject(new Error('Failed to parse CSV file: ' + error.message));
      }
    });
  });
};

/**
 * Extract text from image using OCR (Tesseract.js)
 */
export const extractTextFromImage = async (file: File): Promise<string> => {
  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log(m)
    });
    return result.data.text;
  } catch (error) {
    throw new Error('Failed to extract text from image: ' + (error as Error).message);
  }
};

/**
 * Parse performance data from extracted text (OCR or PDF)
 */
export const parsePerformanceFromText = (text: string): Partial<ProcessedStudentData> => {
  const data: Partial<ProcessedStudentData> = {};

  // Common patterns for extracting scores
  const patterns = {
    attendance: /attendance[:\s]+(\d+(?:\.\d+)?)\s*%?/i,
    assignmentScore: /assignment[s]?[:\s]+(\d+(?:\.\d+)?)/i,
    quizScore: /quiz[:\s]+(\d+(?:\.\d+)?)/i,
    midtermScore: /midterm[:\s]+(\d+(?:\.\d+)?)/i,
    previousResult: /previous[:\s]+(\d+(?:\.\d+)?)/i,
    studyHours: /study[:\s]+(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i,
    extracurricular: /extracurricular[:\s]+(\d+)/i,
  };

  // Extract attendance
  const attendanceMatch = text.match(patterns.attendance);
  if (attendanceMatch) {
    data.attendance = parseFloat(attendanceMatch[1]);
  }

  // Extract assignment score
  const assignmentMatch = text.match(patterns.assignmentScore);
  if (assignmentMatch) {
    data.assignmentScore = parseFloat(assignmentMatch[1]);
  }

  // Extract quiz score
  const quizMatch = text.match(patterns.quizScore);
  if (quizMatch) {
    data.quizScore = parseFloat(quizMatch[1]);
  }

  // Extract midterm score
  const midtermMatch = text.match(patterns.midtermScore);
  if (midtermMatch) {
    data.midtermScore = parseFloat(midtermMatch[1]);
  }

  // Extract previous result
  const previousMatch = text.match(patterns.previousResult);
  if (previousMatch) {
    data.previousResult = parseFloat(previousMatch[1]);
  }

  // Extract study hours
  const studyMatch = text.match(patterns.studyHours);
  if (studyMatch) {
    data.studyHoursPerDay = parseFloat(studyMatch[1]);
  }

  // Extract extracurricular activities
  const extracurricularMatch = text.match(patterns.extracurricular);
  if (extracurricularMatch) {
    data.extracurricularActivities = parseInt(extracurricularMatch[1]);
  }

  // Try to extract numbers from text if specific patterns don't match
  const numbers = text.match(/\d+(?:\.\d+)?/g);
  if (numbers && numbers.length >= 5) {
    if (!data.attendance && numbers[0]) data.attendance = parseFloat(numbers[0]);
    if (!data.assignmentScore && numbers[1]) data.assignmentScore = parseFloat(numbers[1]);
    if (!data.quizScore && numbers[2]) data.quizScore = parseFloat(numbers[2]);
    if (!data.midtermScore && numbers[3]) data.midtermScore = parseFloat(numbers[3]);
    if (!data.previousResult && numbers[4]) data.previousResult = parseFloat(numbers[4]);
  }

  return data;
};

/**
 * Extract text from PDF file
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert to text (basic extraction)
        let text = '';
        for (let i = 0; i < uint8Array.length; i++) {
          const char = String.fromCharCode(uint8Array[i]);
          if (char.match(/[\w\s.,;:\-()]/)) {
            text += char;
          }
        }
        
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
 * Process uploaded file based on type
 */
export const processUploadedFile = async (
  file: File
): Promise<ProcessedStudentData | ProcessedStudentData[]> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (fileExtension === 'csv') {
    // Process CSV file (returns array of students)
    return await parseCSVFile(file);
  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension || '')) {
    // Process image file with OCR
    const extractedText = await extractTextFromImage(file);
    const parsedData = parsePerformanceFromText(extractedText);
    
    return {
      name: 'Student from Image',
      email: `student${Math.random().toString(36).substr(2, 9)}@school.com`,
      studentId: `STU${Math.floor(Math.random() * 10000)}`,
      attendance: parsedData.attendance || 0,
      assignmentScore: parsedData.assignmentScore || 0,
      quizScore: parsedData.quizScore || 0,
      midtermScore: parsedData.midtermScore || 0,
      previousResult: parsedData.previousResult || 0,
      studyHoursPerDay: parsedData.studyHoursPerDay || 0,
      extracurricularActivities: parsedData.extracurricularActivities || 0,
    };
  } else if (fileExtension === 'pdf') {
    // Process PDF file
    const extractedText = await extractTextFromPDF(file);
    const parsedData = parsePerformanceFromText(extractedText);
    
    return {
      name: 'Student from PDF',
      email: `student${Math.random().toString(36).substr(2, 9)}@school.com`,
      studentId: `STU${Math.floor(Math.random() * 10000)}`,
      attendance: parsedData.attendance || 0,
      assignmentScore: parsedData.assignmentScore || 0,
      quizScore: parsedData.quizScore || 0,
      midtermScore: parsedData.midtermScore || 0,
      previousResult: parsedData.previousResult || 0,
      studyHoursPerDay: parsedData.studyHoursPerDay || 0,
      extracurricularActivities: parsedData.extracurricularActivities || 0,
    };
  } else {
    throw new Error('Unsupported file format. Please upload CSV, PDF, or image files.');
  }
};

/**
 * Validate processed student data
 */
export const validateStudentData = (data: ProcessedStudentData): boolean => {
  return (
    data.attendance >= 0 && data.attendance <= 100 &&
    data.assignmentScore >= 0 && data.assignmentScore <= 100 &&
    data.quizScore >= 0 && data.quizScore <= 100 &&
    data.midtermScore >= 0 && data.midtermScore <= 100 &&
    data.previousResult >= 0 && data.previousResult <= 100 &&
    data.studyHoursPerDay >= 0 && data.studyHoursPerDay <= 24 &&
    data.extracurricularActivities >= 0 && data.extracurricularActivities <= 10
  );
};

/**
 * Generate sample CSV template
 */
export const generateCSVTemplate = (): string => {
  const headers = [
    'name',
    'email',
    'student_id',
    'attendance',
    'assignment_score',
    'quiz_score',
    'midterm_score',
    'previous_result',
    'study_hours_per_day',
    'extracurricular_activities'
  ];

  const sampleRows = [
    ['John Doe', 'john@school.com', 'STU001', '85', '78', '82', '75', '80', '4.5', '2'],
    ['Jane Smith', 'jane@school.com', 'STU002', '92', '88', '90', '85', '87', '6', '3'],
    ['Bob Johnson', 'bob@school.com', 'STU003', '78', '70', '75', '68', '72', '3', '1'],
  ];

  const csv = [
    headers.join(','),
    ...sampleRows.map(row => row.join(','))
  ].join('\n');

  return csv;
};

/**
 * Download CSV template
 */
export const downloadCSVTemplate = (): void => {
  const csv = generateCSVTemplate();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'student_data_template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
