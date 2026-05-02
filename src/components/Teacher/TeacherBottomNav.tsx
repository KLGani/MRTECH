import React from 'react';
import { LayoutDashboard, Users, Upload } from 'lucide-react';

type Tab = 'overview' | 'students' | 'upload';

interface TeacherBottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
{ id: 'students' as Tab, label: 'Performance', icon: Users },
  { id: 'upload' as Tab, label: 'Upload', icon: Upload },
];

export const TeacherBottomNav: React.FC<TeacherBottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-16 px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full py-2 px-1 transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherBottomNav;

