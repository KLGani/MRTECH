import React, { useState } from 'react';
import { User } from '../../types';
<<<<<<< HEAD
import { Overview } from './Overview';
import { StudentMarksView } from './StudentMarksView';
import { LayoutDashboard, ClipboardList, LogOut } from 'lucide-react';
=======
import { PerformanceInput } from './PerformanceInput';
import { WhatIfAnalysis } from './WhatIfAnalysis';
import { StudentHistory } from './StudentHistory';
import { Overview } from './Overview';
import { LayoutDashboard, TrendingUp, History, Lightbulb, LogOut } from 'lucide-react';
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

<<<<<<< HEAD
type Tab = 'overview' | 'marks';
=======
type Tab = 'overview' | 'predict' | 'whatif' | 'history';
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
<<<<<<< HEAD
    { id: 'marks' as Tab, label: 'My Marks', icon: ClipboardList },
=======
    { id: 'predict' as Tab, label: 'Predict Performance', icon: TrendingUp },
    { id: 'whatif' as Tab, label: 'What-If Analysis', icon: Lightbulb },
    { id: 'history' as Tab, label: 'History', icon: History },
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
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
<<<<<<< HEAD
                {'studentId' in user ? `ID: ${(user as any).studentId}` : user.email}
=======
                {user.role === 'student' && 'studentId' in user ? `ID: ${user.studentId}` : user.email}
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
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

<<<<<<< HEAD
      {/* Navigation Tabs (Desktop) */}
      <div className="hidden md:block bg-white border-b border-gray-200">
=======
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
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

<<<<<<< HEAD
      {/* Navigation Tabs (Mobile Footer) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
                  isActive ? 'text-blue-700' : 'text-gray-600'
                }`}
                aria-label={tab.label}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                <span className={`text-[11px] mt-1 font-medium ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {activeTab === 'overview' && <Overview user={user} />}
        {activeTab === 'marks' && <StudentMarksView user={user} />}
=======
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <Overview user={user} />}
        {activeTab === 'predict' && <PerformanceInput user={user} />}
        {activeTab === 'whatif' && <WhatIfAnalysis user={user} />}
        {activeTab === 'history' && <StudentHistory user={user} />}
>>>>>>> 69a4e87122e23bed10f2a3bca9aa97544a0fa121
      </main>
    </div>
  );
};
