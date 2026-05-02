const mongoose = require('mongoose');

const subjectScoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B', 'C', 'D', 'F']
  },
  status: {
    type: String,
    enum: ['passing', 'at-risk', 'failing']
  }
}, { _id: false });

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentId: {
    type: String
  },
  class: {
    type: String
  },
  section: {
    type: String
  },
  email: {
    type: String
  },
  
  // Subject-wise scores
  subjects: [subjectScoreSchema],
  
  // Overall metrics
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  assignmentScore: {
    type: Number,
    min: 0,
    max: 100
  },
  quizScore: {
    type: Number,
    min: 0,
    max: 100
  },
  midtermScore: {
    type: Number,
    min: 0,
    max: 100
  },
  previousResult: {
    type: Number,
    min: 0,
    max: 100
  },
  studyHoursPerDay: {
    type: Number,
    min: 0,
    max: 24
  },
  extracurricularActivities: {
    type: Number,
    min: 0,
    max: 10
  },
  
  // Prediction results
  predictedScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  predictedGrade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'B', 'C', 'D', 'F']
  },
  predictedPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Analysis
  failingSubjects: [{
    type: String
  }],
  atRiskSubjects: [{
    type: String
  }],
  passingSubjects: [{
    type: String
  }],
  
  // Recommendations
  recommendations: [{
    type: String
  }],
  
  // Risk level
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Confidence score
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  
  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
predictionSchema.index({ userId: 1, timestamp: -1 });
predictionSchema.index({ studentId: 1 });
predictionSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
predictionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the model
const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;
