import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { storage } from '../../utils/storage';
import { Users, Search, Eye, TrendingUp, AlertCircle } from 'lucide-react';

interface StudentListProps {
  user: User;
}

export const StudentList: React.FC<StudentListProps> = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    const allHistory = storage.getHistory();
    
    // Group by student and get latest
    const studentMap = allHistory.reduce((acc, h) => {
      if (!acc[h.studentId] || new Date(h.timestamp) > new Date(acc[h.studentId].timestamp)) {
        acc[h.studentId] = h;
      }
      return acc;
    }, {} as Record<string, any>);

    const studentList = Object.values(studentMap).sort((a: any, b: any) => 
      a.performance.studentName.localeCompare(b.performance.studentName)
    );

    setStudents(studentList);
  }, []);

  const filteredStudents = students.filter(s =>
    s.performance.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.performance.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.performance.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'text-green-600 bg-green-50';
    if (risk === 'Medium') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (selectedStudent) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedStudent(null)}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          ← Back to Student List
        </button>

        {/* Student Details */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">{selectedStudent.performance.studentName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-purple-200 text-sm">Student ID</p>
              <p className="font-semibold">{selectedStudent.performance.studentId}</p>
            </div>
            <div>
              <p className="text-purple-200 text-sm">Class</p>
              <p className="font-semibold">{selectedStudent.performance.class} {selectedStudent.performance.section}</p>
            </div>
            <div>
              <p className="text-purple-200 text-sm">Email</p>
              <p className="font-semibold text-sm">{selectedStudent.performance.email}</p>
            </div>
            <div>
              <p className="text-purple-200 text-sm">Risk Level</p>
              <p className="font-semibold">{selectedStudent.prediction.riskLevel}</p>
            </div>
          </div>
        </div>

        {/* Performance Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Performance Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Predicted Score:</span>
                <span className="font-bold text-xl text-blue-600">
                  {selectedStudent.prediction.predictedScore.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Grade:</span>
                <span className={`font-bold text-xl ${getGradeColor(selectedStudent.prediction.grade)}`}>
                  {selectedStudent.prediction.grade}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Attendance:</span>
                <span className="font-semibold">{selectedStudent.performance.attendance}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Assignment Score:</span>
                <span className="font-semibold">{selectedStudent.performance.assignmentScore}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Quiz Score:</span>
                <span className="font-semibold">{selectedStudent.performance.quizScore}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Midterm Score:</span>
                <span className="font-semibold">{selectedStudent.performance.midtermScore}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Study Hours/Day:</span>
                <span className="font-semibold">{selectedStudent.performance.studyHoursPerDay} hrs</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Analysis & Recommendations
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">✓ Strengths</h4>
                <ul className="space-y-1">
                  {selectedStudent.prediction.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600">• {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-700 mb-2">→ Areas to Improve</h4>
                <ul className="space-y-1">
                  {selectedStudent.prediction.areasOfImprovement.map((a: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600">• {a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">💡 Top Recommendations</h4>
                <ul className="space-y-1">
                  {selectedStudent.prediction.recommendations.slice(0, 3).map((r: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600">• {r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Student List</h2>
        </div>
        <p className="text-purple-100">View and analyze individual student performance</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Student Table */}
      {filteredStudents.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Predicted Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Grade</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Risk Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{student.performance.studentName}</p>
                        <p className="text-sm text-gray-500">{student.performance.studentId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">
                        {student.performance.class} {student.performance.section}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600">
                        {student.prediction.predictedScore.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${getGradeColor(student.prediction.grade)}`}>
                        {student.prediction.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(student.prediction.riskLevel)}`}>
                        {student.prediction.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-md text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {searchTerm ? 'No students found' : 'No student data available'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try a different search term' : 'Upload student data to get started'}
          </p>
        </div>
      )}
    </div>
  );
};
