<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { User, StudentPerformance } from '../../types';
import { storage } from '../../utils/storage';
import { predictPerformance } from '../../utils/prediction';
import { Lightbulb, TrendingUp } from 'lucide-react';
=======
import React, { useState } from 'react';
import { User, WhatIfScenario } from '../../types';
import { storage } from '../../utils/storage';
import { predictPerformance } from '../../utils/prediction';
import { Lightbulb, TrendingUp, ArrowRight, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121

interface WhatIfAnalysisProps {
  user: User;
}

export const WhatIfAnalysis: React.FC<WhatIfAnalysisProps> = ({ user }) => {
<<<<<<< HEAD
  const [basePerformance, setBasePerformance] = useState<StudentPerformance | null>(null);
  const [whatIf, setWhatIf] = useState({
    attendance: 85,
    assignmentScore: 78,
    quizScore: 82,
    studyHoursPerDay: 4,
  });
  const [basePrediction, setBasePrediction] = useState<any>(null);
  const [whatIfPrediction, setWhatIfPrediction] = useState<any>(null);

  useEffect(() => {
    const history = storage.getHistoryByStudent(user.id);
    if (history.length > 0) {
      const latest = history[0];
      setBasePerformance(latest.performance);
      setBasePrediction(latest.prediction);
      setWhatIf({
        attendance: latest.performance.attendance,
        assignmentScore: latest.performance.assignmentScore,
        quizScore: latest.performance.quizScore,
        studyHoursPerDay: latest.performance.studyHoursPerDay,
      });
    }
  }, [user.id]);

  useEffect(() => {
    if (basePerformance) {
      const result = predictPerformance(basePerformance, whatIf);
      setWhatIfPrediction(result);
    }
  }, [whatIf, basePerformance]);

  const handleChange = (field: string, value: number) => {
    setWhatIf(prev => ({ ...prev, [field]: value }));
  };

  const fields = [
    { key: 'attendance', label: 'Attendance', unit: '%', min: 0, max: 100 },
    { key: 'assignmentScore', label: 'Assignment Score', unit: '', min: 0, max: 100 },
    { key: 'quizScore', label: 'Quiz Score', unit: '', min: 0, max: 100 },
    { key: 'studyHoursPerDay', label: 'Study Hours/Day', unit: 'hrs', min: 0, max: 12 },
  ];

  if (!basePerformance) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-md text-center">
        <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
        <p className="text-gray-500">Please make a prediction first in the "Predict Performance" tab.</p>
=======
  const [baselinePerformance, setBaselinePerformance] = useState<any>(null);
  const [whatIfScenario, setWhatIfScenario] = useState<WhatIfScenario>({});
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  // Load baseline from latest history
  React.useEffect(() => {
    const history = storage.getHistoryByStudent(user.id);
    if (history.length > 0) {
      setBaselinePerformance(history[0].performance);
    }
  }, [user.id]);

  const handleScenarioChange = (field: keyof WhatIfScenario, value: number) => {
    setWhatIfScenario(prev => ({ ...prev, [field]: value }));
  };

  const runAnalysis = () => {
    if (!baselinePerformance) return;

    const basePrediction = predictPerformance(baselinePerformance);
    const whatIfPrediction = predictPerformance(baselinePerformance, whatIfScenario);

    const comparison = [
      {
        name: 'Current',
        score: basePrediction.predictedScore,
        attendance: baselinePerformance.attendance,
        assignments: baselinePerformance.assignmentScore,
        quizzes: baselinePerformance.quizScore,
      },
      {
        name: 'What-If',
        score: whatIfPrediction.predictedScore,
        attendance: whatIfScenario.attendance || baselinePerformance.attendance,
        assignments: whatIfScenario.assignmentScore || baselinePerformance.assignmentScore,
        quizzes: whatIfScenario.quizScore || baselinePerformance.quizScore,
      },
    ];

    setComparisonData(comparison);
  };

  const resetScenario = () => {
    setWhatIfScenario({});
    setComparisonData([]);
  };

  if (!baselinePerformance) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Baseline Data</h3>
          <p className="text-gray-600">
            Please make at least one performance prediction before using What-If Analysis.
          </p>
        </div>
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
      </div>
    );
  }

<<<<<<< HEAD
  const scoreDiff = whatIfPrediction
    ? whatIfPrediction.predictedScore - (basePrediction?.predictedScore || 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          What-If Analysis
        </h2>
        <p className="text-gray-600 mb-6">
          Adjust the sliders below to see how changes in your habits affect your predicted score.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => (
            <div key={field.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                <span className="text-sm font-bold text-blue-600">
                  {whatIf[field.key as keyof typeof whatIf]}{field.unit}
                </span>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                value={whatIf[field.key as keyof typeof whatIf]}
                onChange={(e) => handleChange(field.key, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          ))}
        </div>
      </div>

      {whatIfPrediction && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <p className="text-sm text-gray-500 mb-1">Current Score</p>
            <p className="text-4xl font-bold text-gray-800">{basePrediction?.predictedScore || 0}%</p>
            <p className="text-sm text-gray-500 mt-1">Grade: {basePrediction?.grade || 'N/A'}</p>
          </div>

          <div className={`rounded-xl p-6 shadow-md text-center ${
            scoreDiff > 0 ? 'bg-green-50 border-2 border-green-200' :
            scoreDiff < 0 ? 'bg-red-50 border-2 border-red-200' :
            'bg-gray-50 border-2 border-gray-200'
          }`}>
            <p className="text-sm text-gray-500 mb-1">Change</p>
            <p className={`text-4xl font-bold ${
              scoreDiff > 0 ? 'text-green-600' : scoreDiff < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {scoreDiff > 0 ? '+' : ''}{scoreDiff.toFixed(1)}%
            </p>
            <TrendingUp className={`w-8 h-8 mx-auto mt-2 ${
              scoreDiff > 0 ? 'text-green-500' : scoreDiff < 0 ? 'text-red-500 rotate-180' : 'text-gray-400'
            }`} />
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-md text-center">
            <p className="text-sm text-gray-500 mb-1">What-If Score</p>
            <p className="text-4xl font-bold text-blue-700">{whatIfPrediction.predictedScore}%</p>
            <p className="text-sm text-gray-500 mt-1">Grade: {whatIfPrediction.grade}</p>
          </div>
        </div>
      )}

      {whatIfPrediction && whatIfPrediction.recommendations.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations for This Scenario</h3>
          <div className="space-y-3">
            {whatIfPrediction.recommendations.map((rec: string, i: number) => (
              <div key={i} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-gray-700">
                {rec}
              </div>
            ))}
          </div>
        </div>
=======
  const scoreDifference = comparisonData.length > 0
    ? comparisonData[1].score - comparisonData[0].score
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-8 h-8" />
          <h2 className="text-3xl font-bold">What-If Analysis</h2>
        </div>
        <p className="text-purple-100">
          Explore how changes in your metrics could impact your predicted performance
        </p>
      </div>

      {/* Scenario Builder */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Build Your Scenario</h3>
        <p className="text-sm text-gray-600 mb-6">
          Adjust any metric below to see how it would affect your predicted score
        </p>

        <div className="space-y-6">
          {/* Attendance What-If */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-lg font-semibold text-gray-800">Attendance</label>
                <p className="text-sm text-gray-600">Current: {baselinePerformance.attendance}%</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {whatIfScenario.attendance || baselinePerformance.attendance}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={whatIfScenario.attendance || baselinePerformance.attendance}
              onChange={(e) => handleScenarioChange('attendance', Number(e.target.value))}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Assignment Score What-If */}
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-lg font-semibold text-gray-800">Assignment Score</label>
                <p className="text-sm text-gray-600">Current: {baselinePerformance.assignmentScore}%</p>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {whatIfScenario.assignmentScore || baselinePerformance.assignmentScore}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={whatIfScenario.assignmentScore || baselinePerformance.assignmentScore}
              onChange={(e) => handleScenarioChange('assignmentScore', Number(e.target.value))}
              className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>

          {/* Quiz Score What-If */}
          <div className="bg-yellow-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-lg font-semibold text-gray-800">Quiz Score</label>
                <p className="text-sm text-gray-600">Current: {baselinePerformance.quizScore}%</p>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {whatIfScenario.quizScore || baselinePerformance.quizScore}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={whatIfScenario.quizScore || baselinePerformance.quizScore}
              onChange={(e) => handleScenarioChange('quizScore', Number(e.target.value))}
              className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
            />
          </div>

          {/* Study Hours What-If */}
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-lg font-semibold text-gray-800">Study Hours per Day</label>
                <p className="text-sm text-gray-600">Current: {baselinePerformance.studyHoursPerDay} hours</p>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {whatIfScenario.studyHoursPerDay || baselinePerformance.studyHoursPerDay} hrs
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={whatIfScenario.studyHoursPerDay || baselinePerformance.studyHoursPerDay}
              onChange={(e) => handleScenarioChange('studyHoursPerDay', Number(e.target.value))}
              className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={runAnalysis}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Run Analysis
          </button>
          <button
            onClick={resetScenario}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {comparisonData.length > 0 && (
        <>
          {/* Score Difference */}
          <div className={`rounded-xl p-6 ${
            scoreDifference > 0 ? 'bg-green-50 border-2 border-green-300' :
            scoreDifference < 0 ? 'bg-red-50 border-2 border-red-300' :
            'bg-gray-50 border-2 border-gray-300'
          }`}>
            <div className="flex items-center gap-3">
              <ArrowRight className={`w-6 h-6 ${
                scoreDifference > 0 ? 'text-green-600' :
                scoreDifference < 0 ? 'text-red-600' :
                'text-gray-600'
              }`} />
              <div>
                <h3 className="font-bold text-lg">Impact Analysis</h3>
                <p className="text-sm">
                  {scoreDifference > 0 && (
                    <span className="text-green-700">
                      ✓ Your score could improve by <strong>{scoreDifference.toFixed(1)} points</strong> with these changes!
                    </span>
                  )}
                  {scoreDifference < 0 && (
                    <span className="text-red-700">
                      ⚠ Your score could decrease by <strong>{Math.abs(scoreDifference).toFixed(1)} points</strong> with these changes.
                    </span>
                  )}
                  {scoreDifference === 0 && (
                    <span className="text-gray-700">
                      No significant change in predicted score.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Before vs After Comparison</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8B5CF6" name="Predicted Score" />
                <Bar dataKey="attendance" fill="#10B981" name="Attendance" />
                <Bar dataKey="assignments" fill="#3B82F6" name="Assignments" />
                <Bar dataKey="quizzes" fill="#F59E0B" name="Quizzes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
      )}
    </div>
  );
};
