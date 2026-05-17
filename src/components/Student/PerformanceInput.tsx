import React, { useState } from 'react';
<<<<<<< HEAD
import { User, StudentPerformance, HistoryEntry } from '../../types';
import { predictPerformance } from '../../utils/prediction';
import { storage } from '../../utils/storage';
import { TrendingUp, Save } from 'lucide-react';
import { PredictionDisplay } from './PredictionDisplay';
=======
import { User, StudentPerformance } from '../../types';
import { storage } from '../../utils/storage';
import { predictPerformance } from '../../utils/prediction';
import { PredictionDisplay } from './PredictionDisplay';
import { TrendingUp, Upload, Percent, FileText, Clock, Award } from 'lucide-react';
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121

interface PerformanceInputProps {
  user: User;
}

export const PerformanceInput: React.FC<PerformanceInputProps> = ({ user }) => {
<<<<<<< HEAD
  const [formData, setFormData] = useState({
    attendance: 85,
    assignmentScore: 78,
    quizScore: 82,
    midtermScore: 75,
=======
  const [showPrediction, setShowPrediction] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<any>(null);
  const [formData, setFormData] = useState({
    attendance: 85,
    assignmentScore: 80,
    quizScore: 75,
    midtermScore: 78,
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
    previousResult: 80,
    studyHoursPerDay: 4,
    extracurricularActivities: 2,
  });
<<<<<<< HEAD
  const [prediction, setPrediction] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setPrediction(null);
    setSaved(false);
  };

  const handlePredict = () => {
=======

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
    const performance: StudentPerformance = {
      studentId: user.id,
      studentName: user.name,
      email: user.email,
<<<<<<< HEAD
      class: ('class' in user ? (user as any).class : 'N/A') as string,
      section: ('section' in user ? (user as any).section : 'N/A') as string,
=======
      class: (user as any).class || '10',
      section: (user as any).section || 'A',
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
      ...formData,
      timestamp: new Date().toISOString(),
    };

<<<<<<< HEAD
    const result = predictPerformance(performance);
    setPrediction({ performance, result });
  };

  const handleSave = () => {
    if (!prediction) return;

    const entry: HistoryEntry = {
      id: `${user.id}-${Date.now()}`,
      studentId: user.id,
      performance: prediction.performance,
      prediction: prediction.result,
      timestamp: new Date().toISOString(),
    };

    storage.saveHistory(entry);
    storage.saveStudentData(prediction.performance);
    setSaved(true);
  };

  const fields = [
    { key: 'attendance', label: 'Attendance', unit: '%', min: 0, max: 100, description: 'Class attendance percentage' },
    { key: 'assignmentScore', label: 'Assignment Score', unit: '', min: 0, max: 100, description: 'Average assignment score' },
    { key: 'quizScore', label: 'Quiz Score', unit: '', min: 0, max: 100, description: 'Average quiz score' },
    { key: 'midtermScore', label: 'Midterm Score', unit: '', min: 0, max: 100, description: 'Midterm exam score' },
    { key: 'previousResult', label: 'Previous Result', unit: '', min: 0, max: 100, description: "Last year's final score" },
    { key: 'studyHoursPerDay', label: 'Study Hours/Day', unit: 'hrs', min: 0, max: 12, description: 'Daily study hours' },
    { key: 'extracurricularActivities', label: 'Extracurricular', unit: '', min: 0, max: 10, description: 'Number of activities' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Predict Performance
        </h2>
        <p className="text-gray-600 mb-6">Enter your academic data to get an AI-powered prediction</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => (
            <div key={field.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                <span className="text-sm font-bold text-blue-600">
                  {formData[field.key as keyof typeof formData]}{field.unit}
                </span>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) => handleChange(field.key, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-gray-500">{field.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handlePredict}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Predict Performance
          </button>
          {prediction && !saved && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
          )}
          {saved && (
            <div className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold flex items-center gap-2">
              ✓ Saved!
            </div>
          )}
        </div>
      </div>

      {prediction && <PredictionDisplay result={prediction.result} />}
=======
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-blue-600" />
              Predict Your Performance
            </h2>
            <p className="text-gray-600 mt-1">Enter your academic metrics to get AI-powered predictions</p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUploadMarksCard}
              className="hidden"
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
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
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
    </div>
  );
};
