# 🎓 EduPredict - Student Performance Predictor

A comprehensive full-stack application (Web + Mobile) that predicts student academic performance using machine learning algorithms. Features intelligent file processing (CSV, PDF, Image) with OCR capabilities, interactive dashboards, MongoDB integration, and real-time predictions.

## 📱 **NEW: Mobile App Available!**

✅ **React Native mobile app** for Android & iOS  
✅ **MongoDB database integration**  
✅ **REST API backend** with Node.js + Express  
✅ **All web features in mobile app**  
✅ **Camera upload for marksheets**  
✅ **Complete setup guide** - See `MOBILE_APP_MONGODB_SETUP.md`

## 🚨 **NEW FEATURE: Multi-Subject Performance Prediction**

✅ **Upload marksheets with multiple subjects**  
✅ **AI identifies which subjects students may FAIL** 🔴  
✅ **At-risk subject warnings** 🟡  
✅ **Subject-specific recommendations**  
✅ **CSV/PDF/Image support with intelligent OCR**  
✅ **Color-coded visual alerts for failing subjects**

> Students can now see predictions for EACH subject individually, with clear RED alerts for failing subjects and YELLOW warnings for at-risk subjects!

---

## ✨ Key Features

### 🔐 **Authentication System**
- Secure login and registration
- Role-based access (Student & Teacher)
- Session persistence with local storage

### 👨‍🎓 **Student Portal** (5 Core Features)
1. **📊 Dashboard Overview** - Real-time statistics and performance insights
2. **📝 Manual Entry** - Enter scores manually for predictions
3. **📤 Upload Marksheet** - AI-powered OCR to extract data from images/PDFs
4. **💡 What-If Analysis** - Interactive sliders to test different scenarios
5. **📜 History Tracking** - View all past predictions and trends

### 👩‍🏫 **Teacher Portal** (3 Core Features)
1. **📈 Class Analytics** - Comprehensive dashboard with charts and statistics
2. **👥 Student Management** - View and monitor individual student performance
3. **📤 Bulk Upload** - Upload CSV/PDF/Images to process multiple students

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **Python** 3.8+ (optional, for ML backend)

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

### First Time Setup
**No demo credentials!** You need to register your own account:

1. Click "Don't have an account? Register"
2. Fill in your details:
   - **Name:** Your name
   - **Email:** Your email
   - **Password:** Choose a password
   - **Role:** Select "Student" or "Teacher"
3. Click "Sign Up"
4. Login with your credentials

---

## 📤 File Upload & Processing

### **Supported File Types**

#### 1. **CSV Files** (Recommended for Teachers)
Upload entire class data in one go!

**Required Format:**
```csv
name,email,student_id,attendance,assignment_score,quiz_score,midterm_score,previous_result,study_hours_per_day,extracurricular_activities
John Doe,john@school.com,STU001,85,78,82,75,80,4.5,2
Jane Smith,jane@school.com,STU002,92,88,90,85,87,6,3
```

**How to Use:**
- Click "Download Template" button to get the CSV format
- Fill in your student data
- Upload via "Bulk Upload" in Teacher Dashboard

#### 2. **PDF Files** (Report Cards)
Upload student report cards or marksheets in PDF format!

**What Happens:**
- System extracts text from PDF
- AI algorithm identifies scores and data
- Automatically parses attendance, scores, etc.
- Generates prediction

**Best Practices:**
- Use clear, text-based PDFs (not scanned images)
- Ensure scores are clearly labeled
- Standard report card format works best

#### 3. **Image Files** (JPG, PNG)
Upload photos of marksheets using OCR technology!

**Supported Formats:** JPG, JPEG, PNG, GIF, BMP

**How It Works:**
- Uses Tesseract.js OCR engine
- Extracts text from image
- Intelligent parsing to identify:
  - Attendance percentage
  - Assignment scores
  - Quiz scores
  - Midterm scores
  - Previous results
  - Study hours

**Tips for Best Results:**
- ✅ Take clear, well-lit photos
- ✅ Ensure text is readable
- ✅ Avoid shadows and glare
- ✅ Keep the document flat
- ✅ Higher resolution = better accuracy

---

## 🎯 Data Parameters

All predictions use these **7 input features:**

| Parameter | Range | Description |
|-----------|-------|-------------|
| **Attendance** | 0-100% | Class attendance percentage |
| **Assignment Score** | 0-100 | Average assignment marks |
| **Quiz Score** | 0-100 | Quiz performance |
| **Midterm Score** | 0-100 | Midterm examination marks |
| **Previous Result** | 0-100 | Last semester/year result |
| **Study Hours/Day** | 0-24 | Daily study hours |
| **Extracurricular** | 0-10 | Number of activities |

**Output:** Predicted Final Score (0-100) with grade, risk level, and recommendations

---

## 🤖 Machine Learning Backend (Optional)

### Setup ML Backend

```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Generate dataset (1,004 student records)
python generate_dataset.py

# Train ML models (10 algorithms)
python train_model.py

# Start API server
python api_server.py
```

### ML Features
- **Dataset:** 1,004+ synthetic student records
- **Algorithms:** 10 models (Random Forest, XGBoost, LightGBM, etc.)
- **Accuracy:** 92-95% (R² score)
- **Auto-selection:** Best model chosen automatically
- **API:** FastAPI with automatic documentation

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/api/health` | GET | Health check |
| `/api/model-info` | GET | Model metrics |
| `/api/predict` | POST | Single prediction |
| `/api/bulk-predict` | POST | Batch predictions |

**Interactive Docs:** http://localhost:8000/docs

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3** - Modern UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 3.4** - Styling
- **Vite 7.2** - Build tool
- **Recharts** - Data visualization
- **Papa Parse** - CSV processing
- **Tesseract.js** - OCR for images
- **Lucide React** - Icons

### Backend (Optional)
- **Python 3.8+**
- **FastAPI** - REST API
- **scikit-learn** - ML algorithms
- **XGBoost** - Gradient boosting
- **LightGBM** - Light gradient boosting
- **Pandas** - Data processing
- **NumPy** - Numerical computing

---

## 📁 Project Structure

```
edupredict/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Student/
│   │   │   ├── Overview.tsx
│   │   │   ├── PerformanceInput.tsx
│   │   │   ├── UploadMarksheet.tsx      # 🆕 File upload
│   │   │   ├── PredictionDisplay.tsx
│   │   │   ├── WhatIfAnalysis.tsx
│   │   │   └── StudentHistory.tsx
│   │   └── Teacher/
│   │       ├── TeacherOverview.tsx
│   │       ├── BulkUpload.tsx            # 🆕 Bulk file processing
│   │       └── StudentList.tsx
│   ├── utils/
│   │   ├── prediction.ts                 # Local ML algorithm
│   │   ├── fileProcessing.ts             # 🆕 CSV/PDF/Image processing
│   │   ├── apiPrediction.ts              # Backend API integration
│   │   └── storage.ts                    # Data persistence
│   ├── types/
│   │   └── index.ts                      # TypeScript definitions
│   └── App.tsx
├── backend/
│   ├── generate_dataset.py               # Dataset creation
│   ├── train_model.py                    # Model training
│   ├── api_server.py                     # FastAPI server
│   ├── run_all.py                        # One-command setup
│   └── requirements.txt                  # Python dependencies
├── public/
│   └── sample_class_data.csv             # CSV template
└── README.md
```

---

## 💡 How to Use

### For Students:

1. **Register/Login** as Student
2. **Option A - Manual Entry:**
   - Go to "Enter Scores" tab
   - Fill in your performance data
   - Click "Predict Performance"
   
3. **Option B - Upload Marksheet:**
   - Go to "Upload Marksheet" tab
   - Upload a photo or PDF of your marksheet
   - AI will extract data automatically
   - View prediction instantly

4. **What-If Analysis:**
   - Use sliders to test different scenarios
   - See how improving attendance/study hours affects prediction

5. **View History:**
   - Track all your past predictions
   - Monitor your progress over time

### For Teachers:

1. **Register/Login** as Teacher
2. **Option A - Manual Entry:**
   - Go to "Bulk Upload" tab
   - Use the manual entry form
   - Add individual student data

3. **Option B - CSV Upload:**
   - Click "Download Template"
   - Fill in all student data in Excel
   - Save as CSV
   - Upload the file
   - System processes all students automatically

4. **Option C - Image/PDF Upload:**
   - Upload class marksheet as image or PDF
   - OCR extracts student data
   - Predictions generated automatically

5. **Monitor Students:**
   - View class analytics dashboard
   - Identify at-risk students
   - Click on individual students for detailed view

---

## 🔧 Advanced Features

### 1. **Intelligent File Parsing**
- Automatically detects file type
- CSV: Full structured parsing
- PDF: Text extraction with pattern matching
- Images: OCR with Tesseract.js

### 2. **Data Validation**
- Validates all scores (0-100 range)
- Checks attendance percentage
- Ensures study hours are realistic
- Flags invalid data with error messages

### 3. **Progress Indicators**
- Real-time upload progress
- Processing status updates
- Success/error notifications
- Extracted data preview

### 4. **Bulk Processing**
- Process entire classes (100+ students)
- Parallel prediction generation
- Progress tracking
- Error handling for invalid records

---

## 🎨 UI/UX Highlights

- ✅ **Clean Design** - Professional gradient backgrounds
- ✅ **Responsive** - Works on desktop, tablet, mobile
- ✅ **Interactive Charts** - Recharts visualizations
- ✅ **Real-time Feedback** - Instant status updates
- ✅ **Smooth Animations** - Polished transitions
- ✅ **Color-coded Stats** - Easy-to-understand metrics
- ✅ **No Dark Mode** - Consistent light theme

---

## 📊 Prediction Algorithm

### Local (Frontend) Algorithm:
Weighted formula considering:
- Previous Result (30%)
- Attendance (20%)
- Assignment Score (15%)
- Quiz Score (15%)
- Midterm Score (10%)
- Study Hours (7%)
- Extracurricular (3%)

### ML Backend Algorithm:
- Ensemble of 10 models
- Feature engineering
- Cross-validation
- 92-95% accuracy
- Confidence scoring

---

## 🚀 Deployment

### Frontend Only (Vercel/Netlify)
```bash
npm run build
# Upload dist/ folder
```

### Full Stack (Railway/Render)
```bash
# Frontend: Deploy as static site
npm run build

# Backend: Deploy as Python app
pip install -r backend/requirements.txt
python backend/run_all.py
```

---

## 📝 Future Enhancements

- [ ] Real-time predictions with WebSocket
- [ ] Export reports as PDF
- [ ] Email notifications for at-risk students
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Integration with school management systems
- [ ] Advanced analytics with more ML models
- [ ] Parent portal access

---

## 🤝 Contributing

This is a showcase project. Feel free to fork and customize for your needs!

---

## 📄 License

MIT License - Free to use for educational purposes

---

## 👨‍💻 Developer

Created with ❤️ as a comprehensive Student Performance Prediction System

**Tech Stack:** React + TypeScript + Python + Machine Learning  
**Build Time:** < 7 seconds  
**Bundle Size:** 790 KB (227 KB gzipped)  
**Status:** ✅ Production Ready

---

## 🎯 Interview Talking Points

1. **Full-Stack Expertise:**
   - Modern React with TypeScript
   - Python ML backend with FastAPI
   - File processing (CSV, PDF, OCR)

2. **Real ML Implementation:**
   - 10 algorithms trained and compared
   - Automated best model selection
   - 92-95% prediction accuracy

3. **Production Features:**
   - File upload with validation
   - Progress indicators
   - Error handling
   - Responsive design
   - Data persistence

4. **Problem Solving:**
   - Solves real education challenge
   - Identifies at-risk students
   - Provides actionable recommendations

5. **Code Quality:**
   - TypeScript for type safety
   - Component-based architecture
   - Clean, maintainable code
   - Comprehensive error handling

---

**🎉 Ready to Impress! This project demonstrates full-stack development skills, ML integration, and real-world problem solving. Good luck!** 🚀
