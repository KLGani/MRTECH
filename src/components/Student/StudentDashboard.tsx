import React, { useState } from 'react';
import { User } from '../../types';
import { PerformanceInput } from './PerformanceInput';
import { WhatIfAnalysis } from './WhatIfAnalysis';
import { StudentHistory } from './StudentHistory';
import { Overview } from './Overview';
import UploadMarksheetSimple from './UploadMarksheetSimple';
import { BottomNav } from './BottomNav';
import { LayoutDashboard, TrendingUp, History, Lightbulb, Upload, LogOut } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

type Tab = 'overview' | 'predict' | 'upload' | 'whatif' | 'history';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'predict' as Tab, label: 'Enter Scores', icon: TrendingUp },
    { id: 'upload' as Tab, label: 'Upload Marksheet', icon: Upload },
    { id: 'whatif' as Tab, label: 'What-If Analysis', icon: Lightbulb },
    { id: 'history' as Tab, label: 'History', icon: History },
  ];

  return (
    <div className="min-h-screen">
{/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">E</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">EduPredict</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-600">
                {user.role === 'student' && 'studentId' in user ? `ID: ${user.studentId}` : user.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

{/* Desktop Navigation Tabs - Hidden on Mobile */}
      <div className="bg-white border-b border-gray-200 md:block hidden">
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

{/* Main Content - Add bottom padding for mobile bottom nav */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {activeTab === 'overview' && <Overview user={user} />}
        {activeTab === 'predict' && <PerformanceInput user={user} />}
        {activeTab === 'upload' && <UploadMarksheetSimple />}
        {activeTab === 'whatif' && <WhatIfAnalysis user={user} />}
        {activeTab === 'history' && <StudentHistory user={user} />}
      </main>

      {/* Mobile Bottom Navigation - Only shows on mobile */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
