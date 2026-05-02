import React, { useState } from 'react';
import { User } from '../../types';
import { processUploadedFile, validateStudentData } from '../../utils/fileProcessing';
import { predictPerformance } from '../../utils/prediction';
import { storage } from '../../utils/storage';
import { Upload, FileText, Image as ImageIcon, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface UploadMarksheetProps {
  user: User;
  onUploadSuccess?: () => void;
}

export const UploadMarksheet: React.FC<UploadMarksheetProps> = ({ user, onUploadSuccess }) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('processing');
    setUploadMessage('Processing your marksheet...');
    setExtractedData(null);

    try {
      // Process the uploaded file
      const result = await processUploadedFile(file);
      const studentData = Array.isArray(result) ? result[0] : result;

      // Validate data
      if (!validateStudentData(studentData)) {
        setUploadStatus('error');
        setUploadMessage('Could not extract valid data from the file. Please try manual entry or a clearer image.');
        setTimeout(() => setUploadStatus('idle'), 5000);
        return;
      }

      // Store extracted data for review
      setExtractedData(studentData);

      // Create performance object
      const performance = {
        studentId: user.id,
        studentName: user.name,
        email: user.email,
        class: 'N/A',
        section: 'N/A',
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
        id: Date.now().toString(),
        studentId: performance.studentId,
        performance,
        prediction,
        timestamp: new Date().toISOString(),
      });

      setUploadStatus('success');
      setUploadMessage('Successfully extracted and predicted performance!');
      
      // Reset file input
      e.target.value = '';
      
      if (onUploadSuccess) {
        setTimeout(() => {
          onUploadSuccess();
        }, 2000);
      }

      setTimeout(() => {
        setUploadStatus('idle');
        setExtractedData(null);
      }, 5000);

    } catch (error) {
      setUploadStatus('error');
      setUploadMessage((error as Error).message || 'Failed to process file');
      setTimeout(() => setUploadStatus('idle'), 5000);
    }
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
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center space-x-3 mb-6">
          <Upload className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">Upload Marksheet</h2>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload Your Previous Marksheet
          </h3>
          <p className="text-gray-600 mb-4">
            Upload a photo or PDF of your marksheet for automatic data extraction
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            id="marksheet-upload"
            disabled={uploadStatus === 'processing'}
          />
          <label
            htmlFor="marksheet-upload"
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
              uploadStatus === 'processing'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            {uploadStatus === 'processing' ? 'Processing...' : 'Choose File'}
          </label>
          <p className="text-sm text-gray-500 mt-4">
            Supported formats: PDF, JPG, PNG
          </p>
        </div>
      </div>

      {/* Extracted Data Preview */}
      {extractedData && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Extracted Data</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Attendance</p>
              <p className="font-semibold text-gray-800">{extractedData.attendance}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Assignment Score</p>
              <p className="font-semibold text-gray-800">{extractedData.assignmentScore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quiz Score</p>
              <p className="font-semibold text-gray-800">{extractedData.quizScore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Midterm Score</p>
              <p className="font-semibold text-gray-800">{extractedData.midtermScore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Previous Result</p>
              <p className="font-semibold text-gray-800">{extractedData.previousResult}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Study Hours/Day</p>
              <p className="font-semibold text-gray-800">{extractedData.studyHoursPerDay}</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3">Upload Tips:</h3>
        <ul className="space-y-2 text-purple-800 text-sm">
          <li className="flex items-start">
            <span className="mr-2">📸</span>
            <span>Take a clear, well-lit photo of your marksheet</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📄</span>
            <span>Ensure all text is readable and not blurry</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✨</span>
            <span>The system will automatically extract your scores using AI</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🔍</span>
            <span>If extraction fails, you can always enter data manually</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
