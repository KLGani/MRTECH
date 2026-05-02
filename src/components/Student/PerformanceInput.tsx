import React, { useState } from 'react';
import { User, StudentPerformance } from '../../types';
import { storage } from '../../utils/storage';
import { predictPerformance } from '../../utils/prediction';
import { PredictionDisplay } from './PredictionDisplay';
import { TrendingUp, Upload, Percent, FileText, Clock, Award } from 'lucide-react';

interface PerformanceInputProps {
  user: User;
}

export const PerformanceInput: React.FC<PerformanceInputProps> = ({ user }) => {
  const [showPrediction, setShowPrediction] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<any>(null);
  const [formData, setFormData] = useState({
    attendance: 85,
    assignmentScore: 80,
    quizScore: 75,
    midtermScore: 78,
    previousResult: 80,
    studyHoursPerDay: 4,
    extracurricularActivities: 2,
  });

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const performance: StudentPerformance = {
      studentId: user.id,
      studentName: user.name,
      email: user.email,
      class: (user as any).class || '10',
      section: (user as any).section || 'A',
      ...formData,
      timestamp: new Date().toISOString(),
    };

    const prediction = predictPerformance(performance);

    // Save to history
    storage.saveHistory({
      id: Date.now().toString(),
      studentId: user.id,
      performance,
      prediction,
      timestamp: new Date().toISOString(),
    });

    // Save student data
    storage.saveStudentData(performance);

    setCurrentPrediction({ performance, prediction });
    setShowPrediction(true);
  };

  const handleUploadMarksCard = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate parsing marks card (in real app, would use OCR or CSV parsing)
      alert('Marks card uploaded! In a production app, this would parse your marks automatically.');
      // Simulate auto-fill
      setFormData({
        attendance: 88,
        assignmentScore: 85,
        quizScore: 82,
        midtermScore: 84,
        previousResult: 83,
        studyHoursPerDay: 5,
        extracurricularActivities: 3,
      });
    }
  };

  if (showPrediction && currentPrediction) {
    return (
      <PredictionDisplay
        performance={currentPrediction.performance}
        prediction={currentPrediction.prediction}
        onBack={() => setShowPrediction(false)}
      />
    );
  }

return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              Predict Your Performance
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Enter your academic metrics to get AI-powered predictions</p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUploadMarksCard}
              className="hidden"
            />
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
              <Upload className="w-4 h-4" />
              Upload Marks Card
            </div>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Attendance */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Percent className="w-5 h-5 text-blue-600" />
                Attendance
              </label>
              <span className="text-2xl font-bold text-blue-600">{formData.attendance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.attendance}
              onChange={(e) => handleChange('attendance', Number(e.target.value))}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Assignment Score */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <FileText className="w-5 h-5 text-green-600" />
                Assignment Score
              </label>
              <span className="text-2xl font-bold text-green-600">{formData.assignmentScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.assignmentScore}
              onChange={(e) => handleChange('assignmentScore', Number(e.target.value))}
              className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quiz Score */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Award className="w-5 h-5 text-yellow-600" />
                Quiz Score
              </label>
              <span className="text-2xl font-bold text-yellow-600">{formData.quizScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.quizScore}
              onChange={(e) => handleChange('quizScore', Number(e.target.value))}
              className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Midterm Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.midtermScore}
                onChange={(e) => handleChange('midtermScore', Number(e.target.value))}
                className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Result (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.previousResult}
                onChange={(e) => handleChange('previousResult', Number(e.target.value))}
                className="w-full px-4 py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="bg-indigo-50 rounded-xl p-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                Study Hours/Day
              </label>
              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                value={formData.studyHoursPerDay}
                onChange={(e) => handleChange('studyHoursPerDay', Number(e.target.value))}
                className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Extracurricular */}
          <div className="bg-cyan-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extracurricular Activities (count)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={formData.extracurricularActivities}
              onChange={(e) => handleChange('extracurricularActivities', Number(e.target.value))}
              className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Generate Prediction
          </button>
        </form>
      </div>
    </div>
  );
};
