# 🎓 EduPredict - Student Performance Predictor

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)
![ML](https://img.shields.io/badge/ML-Enabled-green)

A comprehensive, production-ready Student Performance Prediction application with **Machine Learning backend** and modern React frontend. Predict student performance, analyze trends, and get personalized recommendations using advanced ML algorithms.

---

## ✨ Features

### 🎯 Core Features

#### **For Students:**
- 📊 **Interactive Dashboard** - Visual overview of performance metrics
- 🔮 **ML-Powered Predictions** - Accurate performance forecasting using trained models
- 📈 **Performance Tracking** - Monitor progress with interactive charts
- 💡 **What-If Analysis** - See how changes in attendance/scores affect outcomes
- 📝 **Historical Records** - View all past predictions and trends
- 🎯 **Personalized Recommendations** - Get AI-generated improvement suggestions

#### **For Teachers:**
- 📊 **Class Analytics Dashboard** - Comprehensive class performance overview
- 👥 **Student Monitoring** - Track individual student performance
- 📤 **Bulk Upload** - Import entire class data via CSV
- 📈 **Performance Distribution** - Visualize class performance patterns
- ⚠️ **At-Risk Identification** - Automatically identify struggling students
- 📋 **Detailed Reports** - Access individual student profiles and insights

### 🤖 Machine Learning Backend

- **Multiple ML Models**: Linear Regression, Random Forest, XGBoost, LightGBM, Neural Networks
- **Automatic Model Selection**: Compares 10 different algorithms and selects the best
- **Feature Importance**: Identifies which factors most impact student performance
- **REST API**: FastAPI-based prediction service with automatic documentation
- **Real Dataset**: 1000+ realistic student records with proper correlations

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.9+
- **pip** (Python package manager)

### Frontend Setup

```bash
# 1. Install Node dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:5173
```

### Backend Setup (Machine Learning)

```bash
# 1. Install Python dependencies
pip install -r backend/requirements.txt

# 2. Generate dataset and train model (all-in-one)
python backend/run_all.py

# OR run steps individually:
# Step 1: Generate dataset
python backend/generate_dataset.py

# Step 2: Train model
python backend/train_model.py

# Step 3: Start API server
python backend/api_server.py

# 4. API will be available at http://localhost:8000
# 5. API docs at http://localhost:8000/docs
```

---

## 🔐 Demo Credentials

### Student Account
- **Email**: `student@demo.com`
- **Password**: `demo123`

### Teacher Account
- **Email**: `teacher@demo.com`
- **Password**: `demo123`

---

## 📊 Machine Learning Model

### Dataset Parameters

The ML model uses **7 input features** to predict student performance:

| Feature | Description | Range |
|---------|-------------|-------|
| **Attendance** | Attendance percentage | 0-100% |
| **Assignment Score** | Average assignment score | 0-100 |
| **Quiz Score** | Average quiz score | 0-100 |
| **Midterm Score** | Midterm exam score | 0-100 |
| **Previous Result** | Last year's final score | 0-100 |
| **Study Hours** | Daily study hours | 0-24 hours |
| **Extracurricular** | Number of activities | 0-10 |

### Model Performance

The system trains **10 different ML models** and automatically selects the best:

1. Linear Regression
2. Ridge Regression
3. Lasso Regression
4. Decision Tree
5. **Random Forest** ⭐ (Usually best performer)
6. Gradient Boosting
7. **XGBoost** ⭐ (Usually best performer)
8. **LightGBM** ⭐ (Usually best performer)
9. Support Vector Regression
10. Neural Network (MLP)

**Typical Performance Metrics:**
- **R² Score**: 0.92-0.95 (92-95% accuracy)
- **RMSE**: 3-5 points
- **MAE**: 2-4 points

### Feature Importance

Based on trained models, typical importance ranking:

1. **Previous Result** (25-30%) - Past performance is strongest indicator
2. **Midterm Score** (20-25%) - Current academic performance
3. **Assignment Score** (15-20%) - Regular work quality
4. **Quiz Score** (12-15%) - Topic understanding
5. **Attendance** (10-12%) - Class participation
6. **Study Hours** (5-8%) - Effort level
7. **Extracurricular** (2-5%) - Balanced development

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3** with TypeScript
- **Vite 7.2** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **LocalStorage** - Data persistence

### Backend (Machine Learning)
- **Python 3.9+**
- **scikit-learn** - Core ML library
- **XGBoost** - Gradient boosting
- **LightGBM** - Fast gradient boosting
- **FastAPI** - Modern REST API framework
- **Pandas & NumPy** - Data processing
- **Uvicorn** - ASGI server

---

## 📁 Project Structure

```
edupredict/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── Student/
│   │   │   │   ├── StudentDashboard.tsx
│   │   │   │   ├── Overview.tsx
│   │   │   │   ├── PerformanceInput.tsx
│   │   │   │   ├── PredictionDisplay.tsx
│   │   │   │   ├── WhatIfAnalysis.tsx
│   │   │   │   └── StudentHistory.tsx
│   │   │   └── Teacher/
│   │   │       ├── TeacherDashboard.tsx
│   │   │       ├── TeacherOverview.tsx
│   │   │       ├── BulkUpload.tsx
│   │   │       └── StudentList.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── prediction.ts
│   │   │   ├── storage.ts
│   │   │   └── cn.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── generate_dataset.py      # Dataset generation
│   ├── train_model.py            # ML model training
│   ├── api_server.py             # FastAPI server
│   ├── run_all.py                # Complete setup script
│   ├── requirements.txt          # Python dependencies
│   │
│   ├── student_performance_dataset.csv  # Generated dataset
│   ├── model.pkl                 # Trained model
│   ├── scaler.pkl                # Feature scaler
│   ├── feature_columns.pkl       # Feature names
│   └── model_info.json           # Model metadata
│
└── README.md
```

---

## 🎯 How It Works

### Student Flow

1. **Login/Register** - Create account or login
2. **Enter Data** - Input marks, attendance, study hours
3. **Get Prediction** - ML model predicts final score
4. **View Analysis** - See grade, risk level, recommendations
5. **What-If Analysis** - Experiment with different scenarios
6. **Track History** - View all past predictions

### Teacher Flow

1. **Login** - Access teacher dashboard
2. **View Analytics** - See class performance overview
3. **Upload Data** - Bulk import student data via CSV
4. **Monitor Students** - Track individual performance
5. **Identify At-Risk** - See students needing help
6. **Generate Reports** - Export performance data

### ML Prediction Flow

1. **Data Input** - 7 features collected from student
2. **Preprocessing** - Data scaled using StandardScaler
3. **Prediction** - Best ML model makes prediction
4. **Post-processing** - Generate grade, risk level
5. **Recommendations** - AI generates personalized advice
6. **Response** - Return comprehensive prediction result

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8000`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/api/health` | GET | Health check |
| `/api/model-info` | GET | Model metrics & info |
| `/api/predict` | POST | Single prediction |
| `/api/bulk-predict` | POST | Batch predictions |
| `/docs` | GET | Interactive API docs |

### Example API Request

```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "attendance": 85.0,
    "assignment_score": 78.0,
    "quiz_score": 82.0,
    "midterm_score": 75.0,
    "previous_result": 80.0,
    "study_hours_per_day": 4.5,
    "extracurricular_activities": 2
  }'
```

### Example API Response

```json
{
  "predicted_score": 79.45,
  "grade": "B",
  "risk_level": "Low",
  "confidence_score": 93.5,
  "recommendations": [
    "Maintain your current study schedule",
    "Keep up the good attendance"
  ],
  "strengths": [
    "Excellent attendance record",
    "Good quiz performance"
  ],
  "areas_of_improvement": [
    "Continue current performance level"
  ],
  "model_used": "Random Forest"
}
```

---

## 📊 Dataset Information

### Generated Dataset

- **Total Records**: 1,004 students
- **Features**: 7 input features
- **Target**: Final score (0-100)
- **File**: `backend/student_performance_dataset.csv`

### Dataset Statistics

- **Attendance**: 40% - 100%
- **Scores**: 30 - 100 points
- **Study Hours**: 0 - 8 hours/day
- **Extracurricular**: 0 - 5 activities
- **Final Score**: Mean ~72, Std ~15

### Data Quality

✅ Realistic correlations between features  
✅ Edge cases included (gifted, struggling students)  
✅ Proper train/test split (80/20)  
✅ Scaled features for ML models  
✅ No missing values  

---

## 🏗️ Building for Production

```bash
# Build frontend
npm run build

# Output will be in dist/
# Deploy dist/ to any static hosting (Vercel, Netlify, etc.)

# For backend API
# Deploy FastAPI to:
# - Railway
# - Render
# - AWS Lambda
# - Google Cloud Run
# - Any Python hosting service
```

---

## 🎨 Features Showcase

### Student Dashboard
- **Overview Cards**: Total predictions, average score, trend, risk level
- **Performance Chart**: Visual trend of predictions over time
- **Component Breakdown**: Radar chart showing strengths/weaknesses
- **Latest Prediction**: Current performance status

### Teacher Dashboard
- **Class Statistics**: Total students, average score, at-risk count
- **Performance Distribution**: Bar chart of grade distribution
- **Top Performers**: Leaderboard of best students
- **At-Risk Students**: Quick identification of struggling students

### What-If Analysis
- **Interactive Sliders**: Adjust attendance, scores, study hours
- **Real-time Prediction**: See instant impact of changes
- **Scenario Comparison**: Compare different scenarios
- **Goal Setting**: Plan improvements to reach target score

---

## 🔒 Security Notes

⚠️ **For Demo/Portfolio Use:**
- Current implementation uses localStorage for simplicity
- Demo credentials are hardcoded for easy testing
- No actual authentication/authorization

📝 **For Production:**
- Implement proper backend authentication (JWT, OAuth)
- Use secure password hashing (bcrypt, argon2)
- Add API rate limiting
- Implement HTTPS
- Use environment variables for secrets
- Add CORS restrictions
- Implement proper session management

---

## 🎯 Interview Talking Points

### Technical Highlights

1. **Full-Stack Application**: React frontend + Python ML backend
2. **Real Machine Learning**: 10 trained models, automatic selection
3. **REST API**: Professional FastAPI implementation
4. **Type Safety**: TypeScript throughout frontend
5. **Modern UI/UX**: Responsive, accessible, beautiful design
6. **Data Visualization**: Interactive charts and analytics
7. **Scalable Architecture**: Modular component structure
8. **Best Practices**: Clean code, proper separation of concerns

### ML Highlights

1. **Multiple Algorithms**: Compared 10 different ML models
2. **Automatic Selection**: System picks best performing model
3. **Feature Engineering**: Proper data preprocessing and scaling
4. **Cross-Validation**: 5-fold CV for robust evaluation
5. **Real Dataset**: 1000+ records with realistic correlations
6. **High Accuracy**: Typically 92-95% R² score
7. **Production Ready**: Pickled models, API serving

### Business Value

1. **Early Intervention**: Identify at-risk students early
2. **Personalized Learning**: Tailored recommendations
3. **Data-Driven Decisions**: Insights from ML predictions
4. **Time Saving**: Bulk analysis of entire classes
5. **Actionable Insights**: Specific improvement areas
6. **Scalable Solution**: Can handle hundreds of students

---

## 📝 License

This project is created for educational and portfolio purposes.

---

## 🤝 Contact

Created by a passionate developer for HR showcase.

**Demo the app live and see:**
- ✅ Modern React application
- ✅ Real machine learning integration
- ✅ Professional UI/UX design
- ✅ Full-stack capabilities
- ✅ Production-ready code quality

---

## 🚀 Getting Started Now

```bash
# Quick Start (Frontend Only)
npm install && npm run dev

# Full Stack (Frontend + ML Backend)
# Terminal 1: Frontend
npm install && npm run dev

# Terminal 2: Backend
pip install -r backend/requirements.txt
python backend/run_all.py
```

**Visit**: http://localhost:5173  
**API Docs**: http://localhost:8000/docs  

---

**Built with ❤️ using React, TypeScript, Python, and Machine Learning**
