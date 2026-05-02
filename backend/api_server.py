"""
FastAPI server for Student Performance Prediction
Serves the trained ML model via REST API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pickle
import json
import numpy as np
from typing import List, Dict, Any
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="EduPredict API",
    description="Student Performance Prediction API using Machine Learning",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load model artifacts
def load_artifacts():
    """Load trained model, scaler, and metadata"""
    try:
        with open('backend/model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        with open('backend/scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        
        with open('backend/feature_columns.pkl', 'rb') as f:
            feature_columns = pickle.load(f)
        
        with open('backend/model_info.json', 'r') as f:
            model_info = json.load(f)
        
        return model, scaler, feature_columns, model_info
    except Exception as e:
        print(f"Error loading model artifacts: {e}")
        print("Please run 'python backend/train_model.py' first to train the model.")
        return None, None, None, None


# Load artifacts on startup
model, scaler, feature_columns, model_info = load_artifacts()


# Pydantic models for request/response
class StudentData(BaseModel):
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage (0-100)")
    assignment_score: float = Field(..., ge=0, le=100, description="Assignment score (0-100)")
    quiz_score: float = Field(..., ge=0, le=100, description="Quiz score (0-100)")
    midterm_score: float = Field(..., ge=0, le=100, description="Midterm score (0-100)")
    previous_result: float = Field(..., ge=0, le=100, description="Previous result (0-100)")
    study_hours_per_day: float = Field(..., ge=0, le=24, description="Study hours per day (0-24)")
    extracurricular_activities: int = Field(..., ge=0, le=10, description="Number of extracurricular activities (0-10)")

    class Config:
        json_schema_extra = {
            "example": {
                "attendance": 85.0,
                "assignment_score": 78.0,
                "quiz_score": 82.0,
                "midterm_score": 75.0,
                "previous_result": 80.0,
                "study_hours_per_day": 4.5,
                "extracurricular_activities": 2
            }
        }


class PredictionResponse(BaseModel):
    predicted_score: float
    grade: str
    risk_level: str
    confidence_score: float
    recommendations: List[str]
    strengths: List[str]
    areas_of_improvement: List[str]
    model_used: str


class BulkStudentData(BaseModel):
    students: List[StudentData]


# Helper functions
def calculate_grade(score: float) -> str:
    """Calculate letter grade from score"""
    if score >= 90:
        return 'A+'
    elif score >= 80:
        return 'A'
    elif score >= 70:
        return 'B'
    elif score >= 60:
        return 'C'
    elif score >= 50:
        return 'D'
    else:
        return 'F'


def calculate_risk_level(score: float) -> str:
    """Calculate risk level based on score"""
    if score >= 70:
        return 'Low'
    elif score >= 50:
        return 'Medium'
    else:
        return 'High'


def generate_recommendations(data: StudentData, score: float) -> List[str]:
    """Generate personalized recommendations"""
    recommendations = []
    
    if data.attendance < 75:
        recommendations.append(f"Improve attendance (current: {data.attendance:.1f}%). Aim for at least 85%.")
    
    if data.assignment_score < 70:
        recommendations.append("Focus on completing assignments with better quality.")
    
    if data.quiz_score < 70:
        recommendations.append("Review quiz topics regularly and practice more problems.")
    
    if data.study_hours_per_day < 3:
        recommendations.append(f"Increase study hours (current: {data.study_hours_per_day:.1f}h). Aim for 4-5 hours daily.")
    
    if data.extracurricular_activities == 0:
        recommendations.append("Participate in at least 1-2 extracurricular activities for holistic development.")
    elif data.extracurricular_activities > 4:
        recommendations.append("Balance extracurricular activities with academic focus.")
    
    if score < 60:
        recommendations.append("Consider seeking help from teachers or tutors for challenging subjects.")
        recommendations.append("Create a structured study schedule and stick to it.")
    
    if not recommendations:
        recommendations.append("Maintain your excellent performance!")
        recommendations.append("Continue your current study habits and stay consistent.")
    
    return recommendations


def identify_strengths(data: StudentData) -> List[str]:
    """Identify student strengths"""
    strengths = []
    
    if data.attendance >= 85:
        strengths.append("Excellent attendance record")
    
    if data.assignment_score >= 80:
        strengths.append("Strong performance in assignments")
    
    if data.quiz_score >= 80:
        strengths.append("Good quiz performance")
    
    if data.midterm_score >= 80:
        strengths.append("Strong midterm results")
    
    if data.study_hours_per_day >= 5:
        strengths.append("Dedicated study routine")
    
    if data.extracurricular_activities >= 2 and data.extracurricular_activities <= 4:
        strengths.append("Well-balanced extracurricular involvement")
    
    if not strengths:
        strengths.append("Room for growth in multiple areas")
    
    return strengths


def identify_improvements(data: StudentData) -> List[str]:
    """Identify areas needing improvement"""
    improvements = []
    
    if data.attendance < 75:
        improvements.append("Attendance")
    
    if data.assignment_score < 70:
        improvements.append("Assignment completion and quality")
    
    if data.quiz_score < 70:
        improvements.append("Quiz preparation")
    
    if data.midterm_score < 70:
        improvements.append("Exam performance")
    
    if data.study_hours_per_day < 3:
        improvements.append("Daily study time")
    
    if not improvements:
        improvements.append("Continue current performance level")
    
    return improvements


# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "EduPredict API - Student Performance Prediction",
        "version": "1.0.0",
        "status": "active" if model is not None else "model not loaded",
        "endpoints": {
            "predict": "/api/predict",
            "bulk_predict": "/api/bulk-predict",
            "model_info": "/api/model-info",
            "health": "/api/health"
        }
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "timestamp": model_info.get('trained_date') if model_info else None
    }


@app.get("/api/model-info")
async def get_model_info():
    """Get model information and metrics"""
    if model_info is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please train the model first.")
    
    return model_info


@app.post("/api/predict", response_model=PredictionResponse)
async def predict(student_data: StudentData):
    """Predict student performance"""
    
    if model is None or scaler is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please run 'python backend/train_model.py' first."
        )
    
    try:
        # Prepare input data
        input_data = np.array([[
            student_data.attendance,
            student_data.assignment_score,
            student_data.quiz_score,
            student_data.midterm_score,
            student_data.previous_result,
            student_data.study_hours_per_day,
            student_data.extracurricular_activities
        ]])
        
        # Scale input
        input_scaled = scaler.transform(input_data)
        
        # Make prediction
        predicted_score = float(model.predict(input_scaled)[0])
        
        # Ensure score is in valid range
        predicted_score = max(0, min(100, predicted_score))
        
        # Calculate derived values
        grade = calculate_grade(predicted_score)
        risk_level = calculate_risk_level(predicted_score)
        
        # Generate recommendations
        recommendations = generate_recommendations(student_data, predicted_score)
        strengths = identify_strengths(student_data)
        improvements = identify_improvements(student_data)
        
        # Calculate confidence score (based on R² score)
        confidence_score = model_info['metrics']['r2_score'] if model_info else 0.85
        
        return PredictionResponse(
            predicted_score=round(predicted_score, 2),
            grade=grade,
            risk_level=risk_level,
            confidence_score=round(confidence_score * 100, 2),
            recommendations=recommendations,
            strengths=strengths,
            areas_of_improvement=improvements,
            model_used=model_info['model_name'] if model_info else "Unknown"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/api/bulk-predict")
async def bulk_predict(bulk_data: BulkStudentData):
    """Predict performance for multiple students"""
    
    if model is None or scaler is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please train the model first."
        )
    
    try:
        predictions = []
        
        for student_data in bulk_data.students:
            # Reuse single prediction logic
            result = await predict(student_data)
            predictions.append(result.dict())
        
        return {
            "total_students": len(predictions),
            "predictions": predictions,
            "model_used": model_info['model_name'] if model_info else "Unknown"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk prediction failed: {str(e)}")


# Run server
if __name__ == "__main__":
    print("🚀 Starting EduPredict API Server...")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/api/health")
    
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
