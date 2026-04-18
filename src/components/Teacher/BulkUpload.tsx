import React, { useState } from 'react';
import { User, StudentPerformance } from '../../types';
import { storage } from '../../utils/storage';
import { predictPerformance } from '../../utils/prediction';
import { Upload, FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';

interface BulkUploadProps {
  user: User;
}

export const BulkUpload: React.FC<BulkUploadProps> = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleManualEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const performance: StudentPerformance = {
      studentId: formData.get('studentId') as string,
      studentName: formData.get('studentName') as string,
      email: formData.get('email') as string,
      class: formData.get('class') as string,
      section: formData.get('section') as string,
      attendance: Number(formData.get('attendance')),
      assignmentScore: Number(formData.get('assignmentScore')),
      quizScore: Number(formData.get('quizScore')),
      midtermScore: Number(formData.get('midtermScore')),
      previousResult: Number(formData.get('previousResult')),
      studyHoursPerDay: Number(formData.get('studyHoursPerDay')),
      extracurricularActivities: Number(formData.get('extracurricularActivities')),
      timestamp: new Date().toISOString(),
    };

    const prediction = predictPerformance(performance);

    // Save data
    storage.saveStudentData(performance);
    storage.saveHistory({
      id: Date.now().toString(),
      studentId: performance.studentId,
      performance,
      prediction,
      timestamp: new Date().toISOString(),
    });

    setUploadStatus('success');
    setUploadMessage(`Successfully added data for ${performance.studentName}`);
    setUploadedCount(1);
    e.currentTarget.reset();

    setTimeout(() => setUploadStatus('idle'), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate CSV parsing (in production, use a CSV parser library)
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setUploadStatus('error');
          setUploadMessage('CSV file is empty or invalid');
          return;
        }

        // Parse CSV (simplified - assumes correct format)
        const students: StudentPerformance[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length >= 11) {
            students.push({
              studentId: values[0],
              studentName: values[1],
              email: values[2],
              class: values[3],
              section: values[4],
              attendance: Number(values[5]),
              assignmentScore: Number(values[6]),
              quizScore: Number(values[7]),
              midtermScore: Number(values[8]),
              previousResult: Number(values[9]),
              studyHoursPerDay: Number(values[10]),
              extracurricularActivities: Number(values[11] || 0),
              timestamp: new Date().toISOString(),
            });
          }
        }

        // Save all students
        students.forEach(student => {
          const prediction = predictPerformance(student);
          storage.saveStudentData(student);
          storage.saveHistory({
            id: `${Date.now()}-${student.studentId}`,
            studentId: student.studentId,
            performance: student,
            prediction,
            timestamp: new Date().toISOString(),
          });
        });

        setUploadStatus('success');
        setUploadMessage(`Successfully uploaded data for ${students.length} students`);
        setUploadedCount(students.length);

        setTimeout(() => setUploadStatus('idle'), 5000);
      } catch (error) {
        setUploadStatus('error');
        setUploadMessage('Error parsing CSV file. Please check the format.');
      }
    };

    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = `studentId,studentName,email,class,section,attendance,assignmentScore,quizScore,midtermScore,previousResult,studyHoursPerDay,extracurricularActivities
STU001,John Doe,john@example.com,10,A,85,80,75,78,80,4,2
STU002,Jane Smith,jane@example.com,10,A,90,85,88,82,85,5,3
STU003,Mike Johnson,mike@example.com,10,B,78,70,72,75,73,3,1`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_data_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Upload className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Upload Student Data</h2>
        </div>
        <p className="text-purple-100">Add individual student data or bulk upload via CSV</p>
      </div>

      {/* Status Message */}
      {uploadStatus !== 'idle' && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${
          uploadStatus === 'success' ? 'bg-green-50 border-2 border-green-300 text-green-800' :
          'bg-red-50 border-2 border-red-300 text-red-800'
        }`}>
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
          <div>
            <p className="font-semibold">{uploadMessage}</p>
            {uploadStatus === 'success' && uploadedCount > 0 && (
              <p className="text-sm opacity-80">
                Predictions have been generated for all uploaded students.
              </p>
            )}
          </div>
        </div>
      )}

      {/* CSV Upload */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Bulk Upload (CSV)
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Upload a CSV file with student performance data. Make sure it follows the template format.
        </p>

        <div className="flex gap-4 mb-4">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>

        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-1">Click to upload CSV file</p>
            <p className="text-gray-500 text-sm">or drag and drop</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </label>
      </div>

      {/* Manual Entry Form */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Manual Entry</h3>
        <form onSubmit={handleManualEntry} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student ID *</label>
              <input
                type="text"
                name="studentId"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="STU001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
              <input
                type="text"
                name="studentName"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
              <input
                type="text"
                name="class"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <input
                type="text"
                name="section"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attendance (%) *</label>
              <input
                type="number"
                name="attendance"
                min="0"
                max="100"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="85"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Score (%) *</label>
              <input
                type="number"
                name="assignmentScore"
                min="0"
                max="100"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Score (%) *</label>
              <input
                type="number"
                name="quizScore"
                min="0"
                max="100"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="75"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Midterm Score (%) *</label>
              <input
                type="number"
                name="midtermScore"
                min="0"
                max="100"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="78"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Result (%) *</label>
              <input
                type="number"
                name="previousResult"
                min="0"
                max="100"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Study Hours/Day *</label>
              <input
                type="number"
                name="studyHoursPerDay"
                min="0"
                max="12"
                step="0.5"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extracurricular Activities</label>
              <input
                type="number"
                name="extracurricularActivities"
                min="0"
                max="10"
                defaultValue="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
          >
            Add Student Data
          </button>
        </form>
      </div>
    </div>
  );
};
