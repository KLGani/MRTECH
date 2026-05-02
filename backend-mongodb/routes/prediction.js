const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');

// @route   POST /api/prediction/create
// @desc    Create a new prediction
// @access  Public (should be protected in production)
router.post('/create', async (req, res) => {
  try {
    const predictionData = req.body;

    // Validate required fields
    if (!predictionData.userId || !predictionData.studentName) {
      return res.status(400).json({ 
        message: 'userId and studentName are required' 
      });
    }

    // Create new prediction
    const prediction = new Prediction(predictionData);
    await prediction.save();

    res.status(201).json({
      message: 'Prediction saved successfully!',
      prediction
    });
  } catch (error) {
    console.error('Create prediction error:', error);
    res.status(500).json({ 
      message: 'Error saving prediction', 
      error: error.message 
    });
  }
});

// @route   GET /api/prediction/user/:userId
// @desc    Get all predictions for a user
// @access  Public (should be protected in production)
router.get('/user/:userId', async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({
      count: predictions.length,
      predictions
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ 
      message: 'Error fetching predictions', 
      error: error.message 
    });
  }
});

// @route   GET /api/prediction/:id
// @desc    Get a specific prediction by ID
// @access  Public (should be protected in production)
router.get('/:id', async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    res.json(prediction);
  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({ 
      message: 'Error fetching prediction', 
      error: error.message 
    });
  }
});

// @route   GET /api/prediction/student/:studentId
// @desc    Get all predictions for a student by studentId
// @access  Public (should be protected in production)
router.get('/student/:studentId', async (req, res) => {
  try {
    const predictions = await Prediction.find({ studentId: req.params.studentId })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({
      count: predictions.length,
      predictions
    });
  } catch (error) {
    console.error('Get student predictions error:', error);
    res.status(500).json({ 
      message: 'Error fetching student predictions', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/prediction/:id
// @desc    Delete a prediction
// @access  Public (should be protected in production)
router.delete('/:id', async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndDelete(req.params.id);

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    res.json({ 
      message: 'Prediction deleted successfully',
      prediction 
    });
  } catch (error) {
    console.error('Delete prediction error:', error);
    res.status(500).json({ 
      message: 'Error deleting prediction', 
      error: error.message 
    });
  }
});

// @route   POST /api/prediction/bulk
// @desc    Create multiple predictions at once
// @access  Public (should be protected in production)
router.post('/bulk', async (req, res) => {
  try {
    const { predictions } = req.body;

    if (!Array.isArray(predictions) || predictions.length === 0) {
      return res.status(400).json({ 
        message: 'predictions array is required and must not be empty' 
      });
    }

    // Insert multiple predictions
    const savedPredictions = await Prediction.insertMany(predictions);

    res.status(201).json({
      message: `${savedPredictions.length} predictions saved successfully!`,
      count: savedPredictions.length,
      predictions: savedPredictions
    });
  } catch (error) {
    console.error('Bulk create predictions error:', error);
    res.status(500).json({ 
      message: 'Error saving predictions', 
      error: error.message 
    });
  }
});

// @route   GET /api/prediction/stats/:userId
// @desc    Get statistics for a user's predictions
// @access  Public (should be protected in production)
router.get('/stats/:userId', async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.params.userId });

    if (predictions.length === 0) {
      return res.json({
        totalPredictions: 0,
        averageScore: 0,
        failingCount: 0,
        atRiskCount: 0,
        passingCount: 0
      });
    }

    // Calculate statistics
    const totalPredictions = predictions.length;
    const totalScore = predictions.reduce((sum, p) => sum + p.predictedScore, 0);
    const averageScore = totalScore / totalPredictions;
    
    const failingCount = predictions.filter(p => 
      p.failingSubjects && p.failingSubjects.length > 0
    ).length;
    
    const atRiskCount = predictions.filter(p => 
      p.atRiskSubjects && p.atRiskSubjects.length > 0
    ).length;
    
    const passingCount = predictions.filter(p => 
      p.predictedScore >= 50 && 
      (!p.failingSubjects || p.failingSubjects.length === 0)
    ).length;

    res.json({
      totalPredictions,
      averageScore: Math.round(averageScore * 100) / 100,
      failingCount,
      atRiskCount,
      passingCount,
      latestPrediction: predictions[predictions.length - 1]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      message: 'Error calculating statistics', 
      error: error.message 
    });
  }
});

module.exports = router;
