import React, { useState } from 'react';
import { User, StudentPerformance } from '../../types';
import { storage } from '../../utils/storage';
import { predictPerformance } from '../../utils/prediction';
import { processUploadedFile, validateStudentData, downloadCSVTemplate } from '../../utils/fileProcessing';
import { Upload, FileText, Download, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface BulkUploadProps {
  user: User;
}

export const BulkUpload: React.FC<BulkUploadProps> = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('processing');
    setUploadMessage('Processing file...');
    setProcessingProgress(0);

    try {
      // Process the uploaded file (CSV, PDF, or Image)
      const result = await processUploadedFile(file);
      
      // Handle array (CSV) or single object (PDF/Image)
      const studentsData = Array.isArray(result) ? result : [result];
      
      setProcessingProgress(30);
      
      // Validate and process each student
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < studentsData.length; i++) {
        const studentData = studentsData[i];
        
        // Validate data
        if (!validateStudentData(studentData)) {
          errorCount++;
          console.warn('Invalid data for student:', studentData.name);
          continue;
        }
        
        // Create StudentPerformance object
        const performance: StudentPerformance = {
          studentId: studentData.studentId,
          studentName: studentData.name,
          email: studentData.email,
          class: 'N/A', // Can be extracted from CSV if available
          section: 'N/A', // Can be extracted from CSV if available
          attendance: studentData.attendance,
          assignmentScore: studentData.assignmentScore,
          quizScore: studentData.quizScore,
          midtermScore: studentData.midtermScore,
          previousResult: studentData.previousResult,
          studyHoursPerDay: studentData.studyHoursPerDay,
          extracurricularActivities: studentData.extracurricularActivities,
          timestamp: new Date().toISOString(),
        };

        // Get prediction
        const prediction = predictPerformance(performance);

        // Save data
        storage.saveStudentData(performance);
        storage.saveHistory({
          id: Date.now().toString() + '-' + i,
          studentId: performance.studentId,
          performance,
          prediction,
          timestamp: new Date().toISOString(),
        });

        successCount++;
        setProcessingProgress(30 + ((i + 1) / studentsData.length) * 70);
      }

      setUploadedCount(successCount);
      
      if (successCount > 0) {
        setUploadStatus('success');
        setUploadMessage(
          `Successfully processed ${successCount} student(s)` +
          (errorCount > 0 ? `. ${errorCount} student(s) had invalid data.` : '')
        );
      } else {
        setUploadStatus('error');
        setUploadMessage('No valid student data found in the file.');
      }

      // Reset file input
      e.target.value = '';
      
      setTimeout(() => {
        setUploadStatus('idle');
        setProcessingProgress(0);
      }, 5000);

    } catch (error) {
      setUploadStatus('error');
      setUploadMessage((error as Error).message || 'Failed to process file');
      setTimeout(() => setUploadStatus('idle'), 5000);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {uploadStatus !== 'idle' && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            uploadStatus === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : uploadStatus === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          {uploadStatus === 'success' && <CheckCircle className="w-5 h-5" />}
          {uploadStatus === 'error' && <AlertCircle className="w-5 h-5" />}
          {uploadStatus === 'processing' && <Loader className="w-5 h-5 animate-spin" />}
          <div className="flex-1">
            <p className="font-medium">{uploadMessage}</p>
            {uploadStatus === 'success' && (
              <p className="text-sm mt-1">
                {uploadedCount} student record{uploadedCount !== 1 ? 's' : ''} processed successfully
              </p>
            )}
            {uploadStatus === 'processing' && (
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{Math.round(processingProgress)}% complete</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Upload className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Bulk Upload</h2>
          </div>
          <button
            onClick={downloadCSVTemplate}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Template</span>
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload Student Data
          </h3>
          <p className="text-gray-600 mb-4">
            Supports CSV, PDF, and Image files (JPG, PNG)
          </p>
          <input
            type="file"
            accept=".csv,.pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploadStatus === 'processing'}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
              uploadStatus === 'processing'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Upload className="w-5 h-5 mr-2" />
            {uploadStatus === 'processing' ? 'Processing...' : 'Choose File'}
          </label>
          <p className="text-sm text-gray-500 mt-4">
            CSV format: name, email, student_id, attendance, assignment_score, quiz_score, midterm_score, previous_result, study_hours_per_day, extracurricular_activities
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For images/PDFs: Upload marksheet or report card with student performance data
          </p>
        </div>
      </div>

      {/* Manual Entry Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Manual Entry</h2>
        <form onSubmit={handleManualEntry} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID *
              </label>
              <input
                type="text"
                name="studentId"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="STU001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                name="studentName"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="student@school.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <input
                type="text"
                name="class"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <input
                type="text"
                name="section"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance (%) *
              </label>
              <input
                type="number"
                name="attendance"
                required
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="85"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Score *
              </label>
              <input
                type="number"
                name="assignmentScore"
                required
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="78"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Score *
              </label>
              <input
                type="number"
                name="quizScore"
                required
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="82"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Midterm Score *
              </label>
              <input
                type="number"
                name="midtermScore"
                required
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="75"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Result *
              </label>
              <input
                type="number"
                name="previousResult"
                required
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Hours/Day *
              </label>
              <input
                type="number"
                name="studyHoursPerDay"
                required
                min="0"
                max="24"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="4.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extracurricular Activities
              </label>
              <input
                type="number"
                name="extracurricularActivities"
                min="0"
                max="10"
                defaultValue="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Student Data
          </button>
        </form>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Upload Instructions:</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li className="flex items-start">
            <span className="mr-2">📄</span>
            <span><strong>CSV Files:</strong> Use the template provided. Include all required fields.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📷</span>
            <span><strong>Image Files:</strong> Upload clear photos of marksheets or report cards. OCR will extract the data.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📑</span>
            <span><strong>PDF Files:</strong> Upload student report cards in PDF format. Text will be extracted automatically.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Ensure all scores are between 0-100 and attendance is in percentage.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
