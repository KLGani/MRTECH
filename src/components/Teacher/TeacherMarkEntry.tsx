import React, { useState } from 'react';
import { User, StudentMark } from '../../types';
import { storage } from '../../utils/storage';
import { PenLine, Save, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface TeacherMarkEntryProps {
  user: User;
}

interface MarkRow {
  key: string;
  studentEmail: string;
  studentName: string;
  subject: string;
  marks: string;
  totalMarks: string;
  attendance: string;
  remarks: string;
}

const createEmptyRow = (): MarkRow => ({
  key: `row-${Date.now()}-${Math.random()}`,
  studentEmail: '',
  studentName: '',
  subject: '',
  marks: '',
  totalMarks: '100',
  attendance: '',
  remarks: '',
});

export const TeacherMarkEntry: React.FC<TeacherMarkEntryProps> = ({ user }) => {
  const [rows, setRows] = useState<MarkRow[]>([createEmptyRow()]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const updateRow = (key: string, field: keyof MarkRow, value: string) => {
    setRows(prev =>
      prev.map(row => (row.key === key ? { ...row, [field]: value } : row))
    );
    setSaved(false);
    setError('');
  };

  const addRow = () => {
    setRows(prev => [...prev, createEmptyRow()]);
  };

  const removeRow = (key: string) => {
    if (rows.length === 1) return;
    setRows(prev => prev.filter(row => row.key !== key));
  };

  const handleSave = () => {
    setError('');

    // Validate
    const invalid = rows.find(
      row => !row.studentEmail.trim() || !row.studentName.trim() || !row.marks.trim()
    );
    if (invalid) {
      setError('Please fill in Student Email, Student Name, and Marks for all rows.');
      return;
    }

    const marksToSave: StudentMark[] = rows.map(row => ({
      id: `mark-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      studentEmail: row.studentEmail.trim(),
      studentName: row.studentName.trim(),
      teacherId: user.id,
      teacherName: user.name,
      subject: row.subject.trim() || 'General',
      marks: parseFloat(row.marks) || 0,
      totalMarks: parseFloat(row.totalMarks) || 100,
      attendance: parseFloat(row.attendance) || 0,
      remarks: row.remarks.trim(),
      timestamp: new Date().toISOString(),
    }));

    storage.saveMultipleMarks(marksToSave);
    setSaved(true);
    setRows([createEmptyRow()]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <PenLine className="w-6 h-6 text-blue-600" />
          Enter Student Marks
        </h2>
        <p className="text-gray-600 mb-6">
          Enter marks and attendance for students. They will see this data in their portal.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Marks saved successfully! Students can now see these marks.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Email *</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name *</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks *</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, index) => (
                <tr key={row.key} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-3 py-2">
                    <input
                      type="email"
                      value={row.studentEmail}
                      onChange={(e) => updateRow(row.key, 'studentEmail', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="student@school.com"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.studentName}
                      onChange={(e) => updateRow(row.key, 'studentName', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) => updateRow(row.key, 'subject', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Math"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.marks}
                      onChange={(e) => updateRow(row.key, 'marks', e.target.value)}
                      className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="85"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.totalMarks}
                      onChange={(e) => updateRow(row.key, 'totalMarks', e.target.value)}
                      className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.attendance}
                      onChange={(e) => updateRow(row.key, 'attendance', e.target.value)}
                      className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="90"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(e) => updateRow(row.key, 'remarks', e.target.value)}
                      className="w-40 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Good work"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => removeRow(row.key)}
                      disabled={rows.length === 1}
                      className="text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Save className="w-4 h-4" />
            Save All Marks
          </button>
        </div>
      </div>

      {/* Previously entered marks */}
      <EnteredMarksList />
    </div>
  );
};

const EnteredMarksList: React.FC = () => {
  const [marks, setMarks] = useState(storage.getAllMarks());

  const handleDelete = (id: string) => {
    storage.deleteMark(id);
    setMarks(storage.getAllMarks());
  };

  if (marks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Previously Entered Marks ({marks.length} records)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {marks.slice(0, 50).map((mark) => (
              <tr key={mark.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm font-medium text-gray-800">{mark.studentName}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{mark.studentEmail}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{mark.subject}</td>
                <td className="px-4 py-2 text-sm font-semibold text-gray-800">
                  {mark.marks}/{mark.totalMarks}
                  <span className="ml-1 text-xs text-gray-500">
                    ({((mark.marks / mark.totalMarks) * 100).toFixed(0)}%)
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{mark.attendance}%</td>
                <td className="px-4 py-2 text-sm text-gray-500">{mark.remarks || '—'}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(mark.timestamp).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(mark.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
