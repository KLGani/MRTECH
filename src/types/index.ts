export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface Student extends User {
  studentId: string;
  class: string;
  section: string;
}

export interface Teacher extends User {
  teacherId: string;
  subject: string;
}

export interface SubjectScore {
  subjectName: string;
  assignmentScore: number;
  quizScore: number;
  midtermScore: number;
  previousResult: number;
  predictedScore?: number;
  grade?: string;
  status?: 'Pass' | 'Fail' | 'At Risk';
  riskLevel?: 'Low' | 'Medium' | 'High';
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  email: string;
  class: string;
  section: string;
  attendance: number;
  studyHoursPerDay: number;
  extracurricularActivities: number;
  subjects: SubjectScore[];
  timestamp: string;
  // Legacy fields for backward compatibility
  assignmentScore?: number;
  quizScore?: number;
  midtermScore?: number;
  previousResult?: number;
}

export interface SubjectPrediction {
  subjectName: string;
  predictedScore: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'At Risk';
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
}

export interface PredictionResult {
  predictedScore: number;
  grade: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  strengths: string[];
  areasOfImprovement: string[];
  confidenceScore: number;
  subjectPredictions?: SubjectPrediction[];
  failingSubjects?: string[];
  atRiskSubjects?: string[];
}

export interface WhatIfScenario {
  attendance?: number;
  assignmentScore?: number;
  quizScore?: number;
  studyHoursPerDay?: number;
}

export interface HistoryEntry {
  id: string;
  studentId: string;
  performance: StudentPerformance;
  prediction: PredictionResult;
  timestamp: string;
}

export interface ClassData {
  className: string;
  section: string;
  totalStudents: number;
  averageScore: number;
  students: StudentPerformance[];
}
