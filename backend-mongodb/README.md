# EduPredict MongoDB Backend

Node.js + Express + MongoDB backend for the Student Performance Predictor application.

## 📁 Files Created

```
backend-mongodb/
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── server.js             # Main server file
├── models/
│   ├── User.js          # User schema (students & teachers)
│   └── Prediction.js    # Prediction schema
└── routes/
    ├── auth.js          # Authentication routes (login/register)
    └── prediction.js    # Prediction CRUD routes
```

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
cd backend-mongodb
npm install
```

### Step 2: Setup MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for FREE account
3. Create a FREE cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

**Option B: Local MongoDB**

1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Connection string: `mongodb://localhost:27017/edupredict`

### Step 3: Create .env File

Create a `.env` file in the `backend-mongodb/` folder:

```env
MONGODB_URI=mongodb+srv://your-username:password@cluster.mongodb.net/edupredict
PORT=5000
JWT_SECRET=your-super-secret-key-change-this-123456789
NODE_ENV=development
```

⚠️ **Replace with YOUR actual MongoDB connection string!**

### Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully!
🚀 Server is running on port 5000
📡 API URL: http://localhost:5000
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/verify` | Verify JWT token |
| GET | `/api/auth/user/:id` | Get user by ID |

### Prediction Routes (`/api/prediction`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/prediction/create` | Create new prediction |
| GET | `/api/prediction/user/:userId` | Get all predictions for user |
| GET | `/api/prediction/:id` | Get specific prediction |
| GET | `/api/prediction/student/:studentId` | Get predictions by student ID |
| DELETE | `/api/prediction/:id` | Delete prediction |
| POST | `/api/prediction/bulk` | Create multiple predictions |
| GET | `/api/prediction/stats/:userId` | Get user statistics |

## 🧪 Test the API

### Test Health Check

```bash
curl http://localhost:5000/
```

### Register a Student

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@student.com",
    "password": "password123",
    "role": "student",
    "name": "John Doe",
    "studentId": "S001",
    "class": "10",
    "section": "A"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@student.com",
    "password": "password123"
  }'
```

### Create a Prediction

```bash
curl -X POST http://localhost:5000/api/prediction/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_FROM_LOGIN",
    "studentName": "John Doe",
    "studentId": "S001",
    "subjects": [
      {"name": "Mathematics", "score": 85, "percentage": 85, "grade": "A", "status": "passing"},
      {"name": "Science", "score": 78, "percentage": 78, "grade": "B", "status": "passing"}
    ],
    "attendance": 85,
    "predictedScore": 82,
    "predictedGrade": "A",
    "failingSubjects": [],
    "recommendations": ["Keep up the good work!"]
  }'
```

## 🗄️ Database Schema

### User Model

```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  role: String (student | teacher),
  name: String (required),
  studentId: String,
  class: String,
  section: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Prediction Model

```javascript
{
  userId: ObjectId (ref: User),
  studentName: String,
  studentId: String,
  subjects: [{
    name: String,
    score: Number (0-100),
    percentage: Number,
    grade: String,
    status: String
  }],
  attendance: Number (0-100),
  assignmentScore: Number,
  quizScore: Number,
  midtermScore: Number,
  previousResult: Number,
  studyHoursPerDay: Number,
  extracurricularActivities: Number,
  predictedScore: Number,
  predictedGrade: String,
  failingSubjects: [String],
  atRiskSubjects: [String],
  recommendations: [String],
  riskLevel: String,
  timestamp: Date
}
```

## 🔧 Troubleshooting

### MongoDB Connection Failed

- Check your connection string in `.env`
- Make sure MongoDB Atlas IP whitelist includes your IP (0.0.0.0/0 for all)
- Verify username and password are correct

### Port Already in Use

Change the PORT in `.env` file:
```env
PORT=5001
```

### JWT Token Errors

Make sure `JWT_SECRET` is set in `.env` file

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Auto-restart during development

## 🌐 Connect to Frontend

In your React app, update the API URL:

```javascript
// src/config.js
export const API_URL = 'http://localhost:5000/api';
```

Then use it in your API calls:

```javascript
import { API_URL } from './config';

// Register
const response = await fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, role, name })
});
```

## 🚀 Production Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI="your-connection-string"
heroku config:set JWT_SECRET="your-secret"

# Deploy
git push heroku main
```

### Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy!

## ✅ Checklist

- [x] MongoDB connection configured
- [x] User authentication (register/login)
- [x] JWT token system
- [x] Prediction CRUD operations
- [x] Subject-wise data storage
- [x] Bulk prediction support
- [x] Error handling
- [x] CORS enabled

## 🎓 Ready to Use!

Your backend is now ready! Start the server with:

```bash
npm run dev
```

And connect your web/mobile app to:
```
http://localhost:5000/api
```

---

**Built with Node.js, Express, and MongoDB** 🚀
