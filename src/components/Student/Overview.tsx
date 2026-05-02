import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { storage } from '../../utils/storage';
import { TrendingUp, TrendingDown, Award, AlertCircle, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

interface OverviewProps {
  user: User;
}

export const Overview: React.FC<OverviewProps> = ({ user }) => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    averageScore: 0,
    trend: 'stable' as 'up' | 'down' | 'stable',
    latestGrade: 'N/A',
    riskLevel: 'Low' as 'Low' | 'Medium' | 'High',
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const history = storage.getHistoryByStudent(user.id);
    
    if (history.length === 0) {
      return;
    }

    const totalPredictions = history.length;
    const averageScore = history.reduce((sum, h) => sum + h.prediction.predictedScore, 0) / totalPredictions;
    const latest = history[0];
    
    // Determine trend
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (history.length >= 2) {
      const current = history[0].prediction.predictedScore;
      const previous = history[1].prediction.predictedScore;
      if (current > previous + 2) trend = 'up';
      else if (current < previous - 2) trend = 'down';
    }

    setStats({
      totalPredictions,
      averageScore,
      trend,
      latestGrade: latest.prediction.grade,
      riskLevel: latest.prediction.riskLevel,
    });

    // Prepare chart data
    const chartData = history
      .slice(0, 10)
      .reverse()
      .map((h, idx) => ({
        name: `#${idx + 1}`,
        date: format(new Date(h.timestamp), 'MMM dd'),
        score: h.prediction.predictedScore,
        attendance: h.performance.attendance,
        assignments: h.performance.assignmentScore,
        quizzes: h.performance.quizScore,
      }));

    setChartData(chartData);
  }, [user.id]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
        <p className="text-blue-100">Here's your academic performance overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Predictions</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalPredictions}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Average Score</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.averageScore.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.trend === 'up' ? 'bg-green-100' : stats.trend === 'down' ? 'bg-red-100' : 'bg-purple-100'
            }`}>
              {stats.trend === 'up' ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : stats.trend === 'down' ? (
                <TrendingDown className="w-6 h-6 text-red-600" />
              ) : (
                <Activity className="w-6 h-6 text-purple-600" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-600">Trend</span>
          </div>
          <p className="text-3xl font-bold text-gray-800 capitalize">{stats.trend}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.riskLevel === 'Low' ? 'bg-green-100' : stats.riskLevel === 'Medium' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <AlertCircle className={`w-6 h-6 ${
                stats.riskLevel === 'Low' ? 'text-green-600' : stats.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <span className="text-sm font-medium text-gray-600">Risk Level</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.riskLevel}</p>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Predicted Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Component Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Components</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#10B981" name="Attendance" />
                <Bar dataKey="assignments" fill="#6366F1" name="Assignments" />
                <Bar dataKey="quizzes" fill="#F59E0B" name="Quizzes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-md text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Yet</h3>
          <p className="text-gray-600 mb-6">Start by making your first performance prediction!</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Make Prediction
          </button>
        </div>
      )}
    </div>
  );
};
