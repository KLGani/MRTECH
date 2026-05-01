import { StudentPerformance, PredictionResult } from '../types';

// Backend API configuration
const API_BASE_URL = 'https://spp-backend-3hda.onrender.com';

export interface BackendPredictionRequest {
  attendance: number;
  assignment_score: number;
  quiz_score: number;
  midterm_score: number;
  previous_result: number;
  study_hours_per_day: number;
  extracurricular_activities: number;
}

export interface BackendPredictionResponse {
  predicted_score: number;
  grade: string;
  risk_level: 'Low' | 'Medium' | 'High';
  confidence_score: number;
  recommendations: string[];
  strengths: string[];
  areas_of_improvement: string[];
  model_used: string;
}

/**
 * Check if backend ML API is available
 */
export const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.status === 'healthy' && data.model_loaded === true;
  } catch (error) {
    console.log('Backend API not available, using local prediction');
    return false;
  }
};

/**
 * Get prediction from backend ML API
 */
export const getPredictionFromBackend = async (
  performance: StudentPerformance
): Promise<PredictionResult | null> => {
  try {
    const requestData: BackendPredictionRequest = {
      attendance: performance.attendance,
      assignment_score: performance.assignmentScore,
      quiz_score: performance.quizScore,
      midterm_score: performance.midtermScore,
      previous_result: performance.previousResult,
      study_hours_per_day: performance.studyHoursPerDay,
      extracurricular_activities: performance.extracurricularActivities,
    };

    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data: BackendPredictionResponse = await response.json();

    // Convert backend response to our frontend format
    return {
      predictedScore: data.predicted_score,
      grade: data.grade,
      riskLevel: data.risk_level,
      recommendations: data.recommendations,
      strengths: data.strengths,
      areasOfImprovement: data.areas_of_improvement,
      confidenceScore: data.confidence_score,
    };
  } catch (error) {
    console.error('Error getting prediction from backend:', error);
    return null;
  }
};

/**
 * Get model information from backend
 */
export const getModelInfo = async (): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/model-info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error('Error getting model info:', error);
    return null;
  }
};

/**
 * Bulk prediction for multiple students (Teacher use case)
 */
export const getBulkPredictions = async (
  students: StudentPerformance[]
): Promise<BackendPredictionResponse[] | null> => {
  try {
    const requestData = {
      students: students.map(s => ({
        attendance: s.attendance,
        assignment_score: s.assignmentScore,
        quiz_score: s.quizScore,
        midterm_score: s.midtermScore,
        previous_result: s.previousResult,
        study_hours_per_day: s.studyHoursPerDay,
        extracurricular_activities: s.extracurricularActivities,
      })),
    };

    const response = await fetch(`${API_BASE_URL}/api/bulk-predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.predictions;
  } catch (error) {
    console.error('Error getting bulk predictions:', error);
    return null;
  }
};
