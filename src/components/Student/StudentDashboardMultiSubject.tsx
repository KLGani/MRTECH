import { useState } from 'react';
import { LogOut, LayoutDashboard, TrendingUp, History, BookOpen } from 'lucide-react';
import PerformanceInputMultiSubject from './PerformanceInputMultiSubject';
import { PredictionDisplay } from './PredictionDisplay';
import { PredictionResult } from '../../types';

interface Props {
  user: { id: string; name: string; email: string; role: string };
  onLogout: () => void;
}

export default function StudentDashboardMultiSubject({ user, onLogout }: Props) {
  const [currentTab, setCurrentTab] = useState<'input' | 'prediction' | 'history'>('input');
  const [predictionData, setPredictionData] = useState<{ performance: any; prediction: PredictionResult } | null>(null);

  const tabs = [
    { id: 'input', label: 'Enter Subject Scores', icon: BookOpen },
    { id: 'prediction', label: 'View Predictions', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History },
  ];

  const handlePredictionComplete = (data: any) => {
    setPredictionData(data);
    setCurrentTab('prediction');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <LayoutDashboard className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">EduPredict</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}!</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-6">
          {currentTab === 'input' && (
            <PerformanceInputMultiSubject user={user} onPredictionComplete={handlePredictionComplete} />
          )}
          
          {currentTab === 'prediction' && predictionData && (
            <div className="space-y-6">
              {/* Subject-wise Results */}
              {predictionData.prediction.subjectPredictions && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-red-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Subject-wise Performance Prediction</h2>
                  
                  {/* Failing Subjects Alert */}
                  {predictionData.prediction.failingSubjects && predictionData.prediction.failingSubjects.length > 0 && (
                    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
                      <h3 className="text-xl font-bold text-red-700 mb-2">
                        🚨 ALERT: Subjects You May FAIL
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {predictionData.prediction.failingSubjects.map((subject: string) => (
                          <span key={subject} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* At Risk Subjects */}
                  {predictionData.prediction.atRiskSubjects && predictionData.prediction.atRiskSubjects.length > 0 && (
                    <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4 mb-6">
                      <h3 className="text-xl font-bold text-yellow-700 mb-2">
                        ⚠️ WARNING: At-Risk Subjects
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {predictionData.prediction.atRiskSubjects.map((subject: string) => (
                          <span key={subject} className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subject Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {predictionData.prediction.subjectPredictions.map((subject: any) => (
                      <div
                        key={subject.subjectName}
                        className={`rounded-lg p-4 border-2 ${
                          subject.status === 'Fail'
                            ? 'bg-red-50 border-red-500'
                            : subject.status === 'At Risk'
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-green-50 border-green-500'
                        }`}
                      >
                        <h4 className="font-bold text-lg mb-2">{subject.subjectName}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Predicted Score:</span>
                            <span className="font-bold text-xl">{subject.predictedScore}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Grade:</span>
                            <span className="font-bold">{subject.grade}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Status:</span>
                            <span className={`font-bold ${
                              subject.status === 'Fail' ? 'text-red-700' :
                              subject.status === 'At Risk' ? 'text-yellow-700' :
                              'text-green-700'
                            }`}>
                              {subject.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Risk Level:</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              subject.riskLevel === 'High' ? 'bg-red-200 text-red-800' :
                              subject.riskLevel === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-green-200 text-green-800'
                            }`}>
                              {subject.riskLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Prediction */}
              <PredictionDisplay result={predictionData.prediction} />
            </div>
          )}

          {currentTab === 'history' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Prediction History</h2>
              <p className="text-gray-600">View your past predictions and track your progress over time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
