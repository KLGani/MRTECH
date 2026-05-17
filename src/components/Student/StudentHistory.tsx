<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { User, HistoryEntry } from '../../types';
import { storage } from '../../utils/storage';
import { History, TrendingUp, TrendingDown, Award } from 'lucide-react';
=======
import React, { useState, useEffect } from 'react';
import { User, HistoryEntry } from '../../types';
import { storage } from '../../utils/storage';
import { History, TrendingUp, Calendar, Award, ChevronDown, ChevronUp } from 'lucide-react';
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
import { format } from 'date-fns';

interface StudentHistoryProps {
  user: User;
}

export const StudentHistory: React.FC<StudentHistoryProps> = ({ user }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
<<<<<<< HEAD

  useEffect(() => {
    const data = storage.getHistoryByStudent(user.id);
    setHistory(data);
  }, [user.id]);

  const getRiskBadge = (risk: string) => {
    if (risk === 'Low') return 'bg-green-100 text-green-700';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
=======
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const userHistory = storage.getHistoryByStudent(user.id);
    setHistory(userHistory);
  }, [user.id]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'text-green-600 bg-green-50';
    if (risk === 'Medium') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
  };

  if (history.length === 0) {
    return (
<<<<<<< HEAD
      <div className="bg-white rounded-xl p-12 shadow-md text-center">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No History Yet</h3>
        <p className="text-gray-500">Your prediction history will appear here.</p>
=======
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No History Yet</h3>
          <p className="text-gray-600">
            Your prediction history will appear here once you make your first prediction.
          </p>
        </div>
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <History className="w-6 h-6 text-blue-600" />
          Prediction History
        </h2>
        <p className="text-gray-600">{history.length} prediction{history.length !== 1 ? 's' : ''} recorded</p>
      </div>

      <div className="space-y-4">
        {history.map((entry, index) => (
          <div key={entry.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold">#{history.length - index}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {format(new Date(entry.timestamp), 'MMMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(entry.timestamp), 'h:mm a')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Score</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {entry.prediction.predictedScore}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Grade</p>
                  <p className={`text-2xl font-bold ${getGradeColor(entry.prediction.grade)}`}>
                    {entry.prediction.grade}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadge(entry.prediction.riskLevel)}`}>
                  {entry.prediction.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Performance details */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Attendance</p>
                <p className="font-semibold text-gray-800">{entry.performance.attendance}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Assignment</p>
                <p className="font-semibold text-gray-800">{entry.performance.assignmentScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Quiz Score</p>
                <p className="font-semibold text-gray-800">{entry.performance.quizScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Study Hours</p>
                <p className="font-semibold text-gray-800">{entry.performance.studyHoursPerDay} hrs/day</p>
              </div>
            </div>
=======
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <History className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Performance History</h2>
        </div>
        <p className="text-indigo-100">Track your academic journey and progress over time</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-gray-600 text-sm mb-2">Total Predictions</p>
          <p className="text-3xl font-bold text-gray-800">{history.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-gray-600 text-sm mb-2">Average Score</p>
          <p className="text-3xl font-bold text-gray-800">
            {(history.reduce((sum, h) => sum + h.prediction.predictedScore, 0) / history.length).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-gray-600 text-sm mb-2">Latest Grade</p>
          <p className="text-3xl font-bold text-gray-800">{history[0].prediction.grade}</p>
        </div>
      </div>

      {/* History Timeline */}
      <div className="space-y-4">
        {history.map((entry, index) => (
          <div key={entry.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(entry.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    #{history.length - index}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-800">
                        Prediction from {format(new Date(entry.timestamp), 'MMMM dd, yyyy')}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(entry.prediction.grade)}`}>
                        Grade: {entry.prediction.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(entry.timestamp), 'h:mm a')}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {entry.prediction.predictedScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getRiskColor(entry.prediction.riskLevel)}`}>
                    {entry.prediction.riskLevel} Risk
                  </span>
                  {expandedId === entry.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedId === entry.id && (
              <div className="border-t bg-gray-50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      Performance Metrics
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Attendance:</span>
                        <span className="font-semibold">{entry.performance.attendance}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Assignment Score:</span>
                        <span className="font-semibold">{entry.performance.assignmentScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quiz Score:</span>
                        <span className="font-semibold">{entry.performance.quizScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Midterm Score:</span>
                        <span className="font-semibold">{entry.performance.midtermScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Previous Result:</span>
                        <span className="font-semibold">{entry.performance.previousResult}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Study Hours/Day:</span>
                        <span className="font-semibold">{entry.performance.studyHoursPerDay} hrs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Extracurricular:</span>
                        <span className="font-semibold">{entry.performance.extracurricularActivities}</span>
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Key Insights</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-2">✓ Strengths:</p>
                        <ul className="text-sm space-y-1">
                          {entry.prediction.strengths.slice(0, 3).map((s, i) => (
                            <li key={i} className="text-gray-600">• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-700 mb-2">→ Areas to Improve:</p>
                        <ul className="text-sm space-y-1">
                          {entry.prediction.areasOfImprovement.slice(0, 3).map((a, i) => (
                            <li key={i} className="text-gray-600">• {a}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Recommendation */}
                {entry.prediction.recommendations.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-1">💡 Top Recommendation:</p>
                    <p className="text-sm text-blue-700">{entry.prediction.recommendations[0]}</p>
                  </div>
                )}
              </div>
            )}
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
          </div>
        ))}
      </div>
    </div>
  );
};
