import React, { useEffect, useState } from 'react';
import { User, StudentMark } from '../../types';
import { storage } from '../../utils/storage';
import { ClipboardList, Award, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface StudentMarksViewProps {
  user: User;
}

export const StudentMarksView: React.FC<StudentMarksViewProps> = ({ user }) => {
  const [marks, setMarks] = useState<StudentMark[]>([]);

  useEffect(() => {
    const data = storage.getMarksByStudentEmail(user.email);
    setMarks(data);
  }, [user.email]);

  const overallAttendance = marks.length > 0
    ? marks.reduce((sum, m) => sum + m.attendance, 0) / marks.length
    : 0;

  const overallPercentage = marks.length > 0
    ? marks.reduce((sum, m) => sum + (m.marks / m.totalMarks) * 100, 0) / marks.length
    : 0;

  const getGrade = (pct: number) => {
    if (pct >= 90) return { grade: 'A+', color: 'text-green-600 bg-green-50' };
    if (pct >= 85) return { grade: 'A', color: 'text-green-600 bg-green-50' };
    if (pct >= 80) return { grade: 'B+', color: 'text-blue-600 bg-blue-50' };
    if (pct >= 75) return { grade: 'B', color: 'text-blue-600 bg-blue-50' };
    if (pct >= 70) return { grade: 'C+', color: 'text-yellow-600 bg-yellow-50' };
    if (pct >= 65) return { grade: 'C', color: 'text-yellow-600 bg-yellow-50' };
    if (pct >= 60) return { grade: 'D', color: 'text-orange-600 bg-orange-50' };
    return { grade: 'F', color: 'text-red-600 bg-red-50' };
  };

  const getAttendanceColor = (att: number) => {
    if (att >= 90) return 'bg-green-500';
    if (att >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskLevel = () => {
    if (overallPercentage >= 75 && overallAttendance >= 85) return { level: 'Low', color: 'bg-green-100 text-green-700 border-green-200' };
    if (overallPercentage >= 60 && overallAttendance >= 70) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    return { level: 'High', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  if (marks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">My Academic Report 📋</h2>
          <p className="text-blue-100">View your marks and attendance entered by your teachers</p>
        </div>
        <div className="bg-white rounded-xl p-12 shadow-md text-center">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Marks Available</h3>
          <p className="text-gray-500">Your teacher has not entered any marks yet. Check back later!</p>
        </div>
      </div>
    );
  }

  const risk = getRiskLevel();
  const gradeInfo = getGrade(overallPercentage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">My Academic Report 📋</h2>
        <p className="text-blue-100">Marks and attendance entered by your teachers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Percentage */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Overall Score</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{overallPercentage.toFixed(1)}%</p>
        </div>

        {/* Grade */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Grade</span>
          </div>
          <p className={`text-4xl font-bold inline-block px-4 py-1 rounded-lg ${gradeInfo.color}`}>
            {gradeInfo.grade}
          </p>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              {overallAttendance >= 75 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-600">Attendance</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{overallAttendance.toFixed(1)}%</p>
        </div>

        {/* Risk Level */}
        <div className={`rounded-xl p-6 shadow-md border-2 ${risk.color}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/60">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Risk Level</span>
          </div>
          <p className="text-3xl font-bold">{risk.level}</p>
        </div>
      </div>

      {/* Detailed Marks Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Subject-wise Marks
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {marks.map((mark) => {
                const pct = (mark.marks / mark.totalMarks) * 100;
                const gradeInfo = getGrade(pct);
                return (
                  <tr key={mark.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{mark.subject}</p>
                      <p className="text-xs text-gray-500">{new Date(mark.timestamp).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-800">{mark.marks}</span>
                      <span className="text-sm text-gray-500">/{mark.totalMarks}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm font-bold ${gradeInfo.color}`}>
                        {gradeInfo.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getAttendanceColor(mark.attendance)}`}
                            style={{ width: `${Math.min(mark.attendance, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-700">{mark.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{mark.teacherName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{mark.remarks || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strongest Subject */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Strongest Subjects
          </h3>
          <div className="space-y-2">
            {marks
              .sort((a, b) => (b.marks / b.totalMarks) - (a.marks / a.totalMarks))
              .slice(0, 3)
              .map((mark, i) => (
                <div key={mark.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-800">{mark.subject}</span>
                  </div>
                  <span className="text-green-700 font-bold">{((mark.marks / mark.totalMarks) * 100).toFixed(1)}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* Weakest Subject */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            Needs Improvement
          </h3>
          <div className="space-y-2">
            {marks
              .sort((a, b) => (a.marks / a.totalMarks) - (b.marks / b.totalMarks))
              .slice(0, 3)
              .map((mark, i) => (
                <div key={mark.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center text-xs font-bold text-red-700">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-800">{mark.subject}</span>
                  </div>
                  <span className="text-red-700 font-bold">{((mark.marks / mark.totalMarks) * 100).toFixed(1)}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
