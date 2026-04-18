import React from 'react';
import { StudentPerformance, PredictionResult } from '../../types';
import { ArrowLeft, TrendingUp, Award, AlertCircle, CheckCircle, Lightbulb, Target } from 'lucide-react';
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PredictionDisplayProps {
  performance: StudentPerformance;
  prediction: PredictionResult;
  onBack: () => void;
}

export const PredictionDisplay: React.FC<PredictionDisplayProps> = ({
  performance,
  prediction,
  onBack,
}) => {
  const scoreData = [
    { name: 'Score', value: prediction.predictedScore, fill: '#3B82F6' },
  ];

  const componentData = [
    { name: 'Attendance', value: performance.attendance, fill: '#10B981' },
    { name: 'Assignments', value: performance.assignmentScore, fill: '#6366F1' },
    { name: 'Quizzes', value: performance.quizScore, fill: '#F59E0B' },
    { name: 'Midterm', value: performance.midtermScore, fill: '#8B5CF6' },
    { name: 'Previous', value: performance.previousResult, fill: '#EC4899' },
  ];

  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'bg-green-100 text-green-800 border-green-300';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Make Another Prediction
      </button>

      {/* Main Prediction Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Your Performance Prediction</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <p className="text-blue-100 mb-2">Predicted Score</p>
            <p className="text-5xl font-bold">{prediction.predictedScore.toFixed(1)}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <p className="text-blue-100 mb-2">Expected Grade</p>
            <p className={`text-5xl font-bold ${getGradeColor(prediction.grade)}`}>
              {prediction.grade}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <p className="text-blue-100 mb-2">Confidence</p>
            <p className="text-5xl font-bold">{prediction.confidenceScore}%</p>
          </div>
        </div>
      </div>

      {/* Risk Level */}
      <div className={`rounded-xl p-6 border-2 ${getRiskColor(prediction.riskLevel)}`}>
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg">Risk Level: {prediction.riskLevel}</h3>
            <p className="text-sm opacity-80">
              {prediction.riskLevel === 'Low' && 'Excellent! Keep up the great work!'}
              {prediction.riskLevel === 'Medium' && 'Good progress, but there\'s room for improvement.'}
              {prediction.riskLevel === 'High' && 'Attention needed! Consider seeking additional support.'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Visualization */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Score Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              data={scoreData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background
                dataKey="value"
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-3xl font-bold fill-gray-800"
              >
                {prediction.predictedScore.toFixed(1)}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Component Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Performance Components
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={componentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {componentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Your Strengths
          </h3>
          <ul className="space-y-2">
            {prediction.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas of Improvement */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Areas to Improve
          </h3>
          <ul className="space-y-2">
            {prediction.areasOfImprovement.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">→</span>
                <span className="text-gray-700">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          AI-Generated Recommendations
        </h3>
        <div className="space-y-3">
          {prediction.recommendations.map((rec, idx) => (
            <div key={idx} className="flex gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <span className="text-blue-600 font-bold text-lg">{idx + 1}.</span>
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
