import React, { useState } from 'react';
import { User } from '../../types';
import { PerformanceInput } from './PerformanceInput';
import { WhatIfAnalysis } from './WhatIfAnalysis';
import { StudentHistory } from './StudentHistory';
import { Overview } from './Overview';
import { LayoutDashboard, TrendingUp, History, Lightbulb, LogOut } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

type Tab = 'overview' | 'predict' | 'whatif' | 'history';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'predict' as Tab, label: 'Predict Performance', icon: TrendingUp },
    { id: 'whatif' as Tab, label: 'What-If Analysis', icon: Lightbulb },
    { id: 'history' as Tab, label: 'History', icon: History },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">EduPredict</h1>
              <p className="text-sm text-gray-600">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-600">
                {user.role === 'student' && 'studentId' in user ? `ID: ${user.studentId}` : user.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <Overview user={user} />}
        {activeTab === 'predict' && <PerformanceInput user={user} />}
        {activeTab === 'whatif' && <WhatIfAnalysis user={user} />}
        {activeTab === 'history' && <StudentHistory user={user} />}
      </main>
    </div>
  );
};
