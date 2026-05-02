import { StudentPerformance, SubjectPrediction, PredictionResult } from '../types';

// Common subjects in a typical curriculum
export const DEFAULT_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology'
];

// Predict score for a single subject
function predictSubjectScore(
  subjectData: {
    assignmentScore: number;
    quizScore: number;
    midtermScore: number;
    previousResult: number;
  },
  generalFactors: {
    attendance: number;
    studyHoursPerDay: number;
    extracurricularActivities: number;
  }
): number {
  const { assignmentScore, quizScore, midtermScore, previousResult } = subjectData;
  const { attendance, studyHoursPerDay, extracurricularActivities } = generalFactors;

  // Weighted average of different components
  let baseScore = 
    assignmentScore * 0.20 +
    quizScore * 0.20 +
    midtermScore * 0.25 +
    previousResult * 0.35;

  // Attendance impact (significant factor)
  const attendanceMultiplier = 0.70 + (attendance / 100) * 0.30;
  baseScore *= attendanceMultiplier;

  // Study hours impact
  const studyBonus = Math.min(studyHoursPerDay * 2, 8);
  baseScore += studyBonus;

  // Extracurricular penalty/bonus (too many = less study time)
  if (extracurricularActivities > 3) {
    baseScore -= (extracurricularActivities - 3) * 1.5;
  } else if (extracurricularActivities >= 1 && extracurricularActivities <= 2) {
    baseScore += 2; // Balanced student bonus
  }

  // Ensure score is within 0-100
  return Math.max(0, Math.min(100, Math.round(baseScore)));
}

// Determine grade from score
function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

// Determine pass/fail status (typically 40% is passing)
function getStatus(score: number): 'Pass' | 'Fail' | 'At Risk' {
  if (score >= 50) return 'Pass';
  if (score >= 40) return 'At Risk';
  return 'Fail';
}

// Determine risk level
function getRiskLevel(score: number): 'Low' | 'Medium' | 'High' {
  if (score >= 70) return 'Low';
  if (score >= 50) return 'Medium';
  return 'High';
}

// Generate subject-specific recommendations
function getSubjectRecommendations(
  subjectName: string,
  score: number,
  subjectData: {
    assignmentScore: number;
    quizScore: number;
    midtermScore: number;
    previousResult: number;
  }
): string[] {
  const recommendations: string[] = [];

  if (score < 40) {
    recommendations.push(`⚠️ URGENT: ${subjectName} needs immediate attention - failing grade predicted`);
    recommendations.push(`Consider extra tutoring sessions for ${subjectName}`);
    recommendations.push(`Review fundamental concepts in ${subjectName}`);
  } else if (score < 50) {
    recommendations.push(`⚡ ${subjectName} is at risk - focus on improvement`);
    recommendations.push(`Practice more ${subjectName} problems daily`);
  } else if (score < 70) {
    recommendations.push(`📚 ${subjectName} needs moderate improvement`);
    recommendations.push(`Dedicate 1-2 hours daily to ${subjectName}`);
  }

  // Specific weak areas
  if (subjectData.assignmentScore < 50) {
    recommendations.push(`Complete all ${subjectName} assignments on time`);
  }
  if (subjectData.quizScore < 50) {
    recommendations.push(`Practice ${subjectName} quiz questions regularly`);
  }
  if (subjectData.midtermScore < 50) {
    recommendations.push(`Review ${subjectName} exam preparation strategies`);
  }

  return recommendations;
}

// Main prediction function with subject-wise analysis
export function predictPerformanceWithSubjects(
  performance: StudentPerformance
): PredictionResult {
  const generalFactors = {
    attendance: performance.attendance,
    studyHoursPerDay: performance.studyHoursPerDay,
    extracurricularActivities: performance.extracurricularActivities
  };

  const subjectPredictions: SubjectPrediction[] = [];
  const failingSubjects: string[] = [];
  const atRiskSubjects: string[] = [];
  let totalPredictedScore = 0;

  // Process each subject
  performance.subjects.forEach(subject => {
    const predictedScore = predictSubjectScore(
      {
        assignmentScore: subject.assignmentScore,
        quizScore: subject.quizScore,
        midtermScore: subject.midtermScore,
        previousResult: subject.previousResult
      },
      generalFactors
    );

    const grade = getGrade(predictedScore);
    const status = getStatus(predictedScore);
    const riskLevel = getRiskLevel(predictedScore);
    const recommendations = getSubjectRecommendations(
      subject.subjectName,
      predictedScore,
      subject
    );

    subjectPredictions.push({
      subjectName: subject.subjectName,
      predictedScore,
      grade,
      status,
      riskLevel,
      recommendations
    });

    totalPredictedScore += predictedScore;

    // Track failing and at-risk subjects
    if (status === 'Fail') {
      failingSubjects.push(subject.subjectName);
    } else if (status === 'At Risk') {
      atRiskSubjects.push(subject.subjectName);
    }
  });

  // Calculate overall average
  const overallPredictedScore = Math.round(
    totalPredictedScore / performance.subjects.length
  );
  const overallGrade = getGrade(overallPredictedScore);
  const overallRiskLevel = getRiskLevel(overallPredictedScore);

  // Generate overall recommendations
  const recommendations: string[] = [];
  const strengths: string[] = [];
  const areasOfImprovement: string[] = [];

  // Failing subjects warnings
  if (failingSubjects.length > 0) {
    recommendations.push(
      `🚨 CRITICAL: You may fail in ${failingSubjects.length} subject(s): ${failingSubjects.join(', ')}`
    );
    recommendations.push('Seek immediate help from teachers and tutors');
    areasOfImprovement.push(`Focus on failing subjects: ${failingSubjects.join(', ')}`);
  }

  // At-risk subjects warnings
  if (atRiskSubjects.length > 0) {
    recommendations.push(
      `⚠️ WARNING: ${atRiskSubjects.length} subject(s) at risk: ${atRiskSubjects.join(', ')}`
    );
    areasOfImprovement.push(`Improve at-risk subjects: ${atRiskSubjects.join(', ')}`);
  }

  // Attendance recommendations
  if (performance.attendance < 75) {
    recommendations.push('⚠️ Low attendance is affecting all subjects - improve to at least 85%');
    areasOfImprovement.push('Attendance (critical factor)');
  } else if (performance.attendance >= 90) {
    strengths.push('Excellent attendance record');
  }

  // Study hours recommendations
  if (performance.studyHoursPerDay < 3) {
    recommendations.push('📚 Increase daily study hours to at least 4-5 hours');
    areasOfImprovement.push('Study hours per day');
  } else if (performance.studyHoursPerDay >= 5) {
    strengths.push('Good study routine');
  }

  // Extracurricular balance
  if (performance.extracurricularActivities > 4) {
    recommendations.push('Consider reducing extracurricular activities to focus on academics');
    areasOfImprovement.push('Time management between studies and activities');
  } else if (performance.extracurricularActivities >= 1 && performance.extracurricularActivities <= 3) {
    strengths.push('Well-balanced extracurricular involvement');
  }

  // Subject-specific strengths
  const passingSubjects = subjectPredictions.filter(s => s.status === 'Pass' && s.predictedScore >= 70);
  if (passingSubjects.length > 0) {
    strengths.push(
      `Strong performance in: ${passingSubjects.map(s => s.subjectName).join(', ')}`
    );
  }

  // Overall performance recommendations
  if (overallPredictedScore >= 80) {
    recommendations.push('🌟 Excellent overall performance! Keep up the great work!');
  } else if (overallPredictedScore >= 60) {
    recommendations.push('Good progress! Focus on weak subjects to improve further');
  } else {
    recommendations.push('Need significant improvement across subjects');
  }

  // Calculate confidence score
  const confidenceScore = Math.min(95, 70 + performance.attendance * 0.2 + (performance.subjects.length * 2));

  return {
    predictedScore: overallPredictedScore,
    grade: overallGrade,
    riskLevel: overallRiskLevel,
    recommendations,
    strengths,
    areasOfImprovement,
    confidenceScore: Math.round(confidenceScore),
    subjectPredictions,
    failingSubjects,
    atRiskSubjects
  };
}

// Helper function to convert old format to new subject-based format
export function convertLegacyPerformance(
  oldPerformance: StudentPerformance
): StudentPerformance {
  // If already has subjects, return as is
  if (oldPerformance.subjects && oldPerformance.subjects.length > 0) {
    return oldPerformance;
  }

  // Convert old single-score format to multi-subject format
  // Use the old scores for a default "General" subject
  const subjects = [
    {
      subjectName: 'Mathematics',
      assignmentScore: oldPerformance.assignmentScore || 0,
      quizScore: oldPerformance.quizScore || 0,
      midtermScore: oldPerformance.midtermScore || 0,
      previousResult: oldPerformance.previousResult || 0
    }
  ];

  return {
    ...oldPerformance,
    subjects
  };
}
