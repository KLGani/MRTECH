import Papa from 'papaparse';
import Tesseract from 'tesseract.js';
import { StudentPerformance, SubjectScore } from '../types';

// Extract subject-wise data from CSV
export async function processCSVWithSubjects(file: File): Promise<StudentPerformance[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const students: StudentPerformance[] = [];
          const data = results.data as any[];

          data.forEach((row, index) => {
            // Extract general info
            const studentId = row['Student ID'] || row['studentId'] || `STU${Date.now()}${index}`;
            const studentName = row['Student Name'] || row['name'] || row['Name'] || 'Unknown';
            const email = row['Email'] || row['email'] || `student${index}@school.com`;
            const className = row['Class'] || row['class'] || '10';
            const section = row['Section'] || row['section'] || 'A';
            const attendance = parseFloat(row['Attendance'] || row['attendance'] || '75');
            const studyHours = parseFloat(row['Study Hours'] || row['studyHoursPerDay'] || '3');
            const extracurricular = parseInt(row['Extracurricular'] || row['extracurricularActivities'] || '2');

            // Extract subjects - check for multiple subject columns
            const subjects: SubjectScore[] = [];
            
            // Common subject patterns in CSV
            const subjectNames = [
              'Mathematics', 'Science', 'English', 'Social Studies',
              'Computer Science', 'Physics', 'Chemistry', 'Biology',
              'Hindi', 'History', 'Geography', 'Economics'
            ];

            subjectNames.forEach(subjectName => {
              // Check if this subject exists in the CSV
              const assignmentKey = `${subjectName} Assignment` || `${subjectName}_Assignment`;
              const quizKey = `${subjectName} Quiz` || `${subjectName}_Quiz`;
              const midtermKey = `${subjectName} Midterm` || `${subjectName}_Midterm`;
              const previousKey = `${subjectName} Previous` || `${subjectName}_Previous`;

              if (row[assignmentKey] || row[`${subjectName}_Assignment`]) {
                const assignment = parseFloat(row[assignmentKey] || row[`${subjectName}_Assignment`] || '0');
                const quiz = parseFloat(row[quizKey] || row[`${subjectName}_Quiz`] || '0');
                const midterm = parseFloat(row[midtermKey] || row[`${subjectName}_Midterm`] || '0');
                const previous = parseFloat(row[previousKey] || row[`${subjectName}_Previous`] || '0');

                if (assignment > 0 || quiz > 0 || midterm > 0 || previous > 0) {
                  subjects.push({
                    subjectName,
                    assignmentScore: assignment,
                    quizScore: quiz,
                    midtermScore: midterm,
                    previousResult: previous
                  });
                }
              }
            });

            // If no subjects found with full names, try numbered subjects
            if (subjects.length === 0) {
              for (let i = 1; i <= 8; i++) {
                const subjectName = row[`Subject ${i} Name`] || row[`Subject${i}_Name`] || `Subject ${i}`;
                const assignment = parseFloat(row[`Subject ${i} Assignment`] || row[`Subject${i}_Assignment`] || '0');
                const quiz = parseFloat(row[`Subject ${i} Quiz`] || row[`Subject${i}_Quiz`] || '0');
                const midterm = parseFloat(row[`Subject ${i} Midterm`] || row[`Subject${i}_Midterm`] || '0');
                const previous = parseFloat(row[`Subject ${i} Previous`] || row[`Subject${i}_Previous`] || '0');

                if (assignment > 0 || quiz > 0 || midterm > 0 || previous > 0) {
                  subjects.push({
                    subjectName,
                    assignmentScore: assignment,
                    quizScore: quiz,
                    midtermScore: midterm,
                    previousResult: previous
                  });
                }
              }
            }

            // Validate and add student
            if (subjects.length > 0 && attendance >= 0 && attendance <= 100) {
              students.push({
                studentId,
                studentName,
                email,
                class: className,
                section,
                attendance,
                studyHoursPerDay: studyHours,
                extracurricularActivities: extracurricular,
                subjects,
                timestamp: new Date().toISOString()
              });
            }
          });

          resolve(students);
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

// Extract subject data from image using OCR
export async function processImageWithSubjects(file: File): Promise<SubjectScore[]> {
  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log(m)
    });

    const text = result.data.text;
    console.log('Extracted text:', text);

    const subjects: SubjectScore[] = [];

    // Pattern 1: Look for subject names followed by scores
    const subjectPatterns = [
      /(?:Mathematics|Math|Maths)[:\s]+(?:Assignment|Assgn)[:\s]*(\d+).*?(?:Quiz)[:\s]*(\d+).*?(?:Midterm|Mid)[:\s]*(\d+).*?(?:Previous|Prev)[:\s]*(\d+)/is,
      /(?:Science|Sci)[:\s]+(?:Assignment|Assgn)[:\s]*(\d+).*?(?:Quiz)[:\s]*(\d+).*?(?:Midterm|Mid)[:\s]*(\d+).*?(?:Previous|Prev)[:\s]*(\d+)/is,
      /(?:English|Eng)[:\s]+(?:Assignment|Assgn)[:\s]*(\d+).*?(?:Quiz)[:\s]*(\d+).*?(?:Midterm|Mid)[:\s]*(\d+).*?(?:Previous|Prev)[:\s]*(\d+)/is,
      /(?:Social Studies|Social|SS)[:\s]+(?:Assignment|Assgn)[:\s]*(\d+).*?(?:Quiz)[:\s]*(\d+).*?(?:Midterm|Mid)[:\s]*(\d+).*?(?:Previous|Prev)[:\s]*(\d+)/is,
      /(?:Computer Science|Computer|CS)[:\s]+(?:Assignment|Assgn)[:\s]*(\d+).*?(?:Quiz)[:\s]*(\d+).*?(?:Midterm|Mid)[:\s]*(\d+).*?(?:Previous|Prev)[:\s]*(\d+)/is,
      /(?:Physics|Phy)[:\s]+(?:Assignment|Assgn)[:\s]*(\d+).*?(?:Quiz)[:\s]*(\d+).*?(?:Midterm|Mid)[:\s]*(\d+).*?(?:Previous|Prev)[:\s]*(\d+)/is,
      /(?:Chemistry|Chem)[:\s]+(?:Assignment|Assgn)[:\s]*(\d+).*?(?:Quiz)[:\s]*(\d+).*?(?:Midterm|Mid)[:\s]*(\d+).*?(?:Previous|Prev)[:\s]*(\d+)/is,
      /(?:Biology|Bio)[:\s]+(?:Assignment|Assgn)[:\s]*(\d+).*?(?:Quiz)[:\s]*(\d+).*?(?:Midterm|Mid)[:\s]*(\d+).*?(?:Previous|Prev)[:\s]*(\d+)/is
    ];

    const subjectNames = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];

    subjectPatterns.forEach((pattern, index) => {
      const match = text.match(pattern);
      if (match) {
        subjects.push({
          subjectName: subjectNames[index],
          assignmentScore: parseInt(match[1]) || 0,
          quizScore: parseInt(match[2]) || 0,
          midtermScore: parseInt(match[3]) || 0,
          previousResult: parseInt(match[4]) || 0
        });
      }
    });

    // Pattern 2: Table format - extract all numbers in groups of 4
    if (subjects.length === 0) {
      const numbers = text.match(/\d+/g);
      if (numbers && numbers.length >= 4) {
        const defaultSubjects = ['Mathematics', 'Science', 'English', 'Social Studies'];
        for (let i = 0; i < Math.min(defaultSubjects.length, Math.floor(numbers.length / 4)); i++) {
          const startIdx = i * 4;
          subjects.push({
            subjectName: defaultSubjects[i],
            assignmentScore: parseInt(numbers[startIdx]) || 0,
            quizScore: parseInt(numbers[startIdx + 1]) || 0,
            midtermScore: parseInt(numbers[startIdx + 2]) || 0,
            previousResult: parseInt(numbers[startIdx + 3]) || 0
          });
        }
      }
    }

    return subjects;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
}

// Extract subject data from PDF
export async function processPDFWithSubjects(file: File): Promise<SubjectScore[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const subjects: SubjectScore[] = [];

        // Similar patterns as image processing
        const subjectNames = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];
        
        subjectNames.forEach(subjectName => {
          // Pattern: Subject Name followed by 4 numbers (assignment, quiz, midterm, previous)
          const pattern = new RegExp(`${subjectName}[:\\s]+(?:Assignment|Assgn)[:\\s]*(\\d+).*?(?:Quiz)[:\\s]*(\\d+).*?(?:Midterm|Mid)[:\\s]*(\\d+).*?(?:Previous|Prev)[:\\s]*(\\d+)`, 'is');
          const match = text.match(pattern);
          
          if (match) {
            subjects.push({
              subjectName,
              assignmentScore: parseInt(match[1]) || 0,
              quizScore: parseInt(match[2]) || 0,
              midtermScore: parseInt(match[3]) || 0,
              previousResult: parseInt(match[4]) || 0
            });
          }
        });

        // Fallback: Extract all numbers
        if (subjects.length === 0) {
          const numbers = text.match(/\d+/g);
          if (numbers && numbers.length >= 4) {
            const defaultSubjects = ['Mathematics', 'Science', 'English', 'Social Studies'];
            for (let i = 0; i < Math.min(defaultSubjects.length, Math.floor(numbers.length / 4)); i++) {
              const startIdx = i * 4;
              subjects.push({
                subjectName: defaultSubjects[i],
                assignmentScore: parseInt(numbers[startIdx]) || 0,
                quizScore: parseInt(numbers[startIdx + 1]) || 0,
                midtermScore: parseInt(numbers[startIdx + 2]) || 0,
                previousResult: parseInt(numbers[startIdx + 3]) || 0
              });
            }
          }
        }

        resolve(subjects);
      } catch (error) {
        reject(new Error('Failed to extract data from PDF'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsText(file);
  });
}
