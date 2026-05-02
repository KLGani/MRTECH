import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { processMarksheetFile, ParsedStudentData, SubjectScore } from '../../utils/fileProcessingFixed';

const UploadMarksheetSimple: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<ParsedStudentData | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setStudentData(null);

    try {
      console.log('Uploading file:', file.name);
      
      const data = await processMarksheetFile(file);

      if (data && data.subjects.length > 0) {
        console.log('Successfully extracted data:', data);
        setStudentData(data);
      } else {
        setError('Could not extract subject data from the file. Please ensure your file contains subjects and scores.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'An error occurred while processing the file');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FAILING': return 'border-red-500 bg-red-50';
      case 'AT_RISK': return 'border-yellow-500 bg-yellow-50';
      case 'PASSING': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FAILING': return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded">❌ FAILING</span>;
      case 'AT_RISK': return <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-200 rounded">⚠️ AT RISK</span>;
      case 'PASSING': return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded">✅ PASSING</span>;
      default: return null;
    }
  };

  const failingSubjects = studentData?.subjects.filter(s => s.status === 'FAILING') || [];
  const atRiskSubjects = studentData?.subjects.filter(s => s.status === 'AT_RISK') || [];
  const passingSubjects = studentData?.subjects.filter(s => s.status === 'PASSING') || [];

return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Marksheet</h2>
          <p className="text-gray-600">
            Upload your marksheet (CSV, PDF, or Image) to automatically analyze your performance
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <>
                  <Loader className="w-12 h-12 text-blue-500 mb-4 animate-spin" />
                  <p className="text-blue-600 font-medium">Processing your file...</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-blue-500 mb-4" />
                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV, PDF, or Image (JPG, PNG)</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv,.pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* File Format Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Tips for Best Results:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>CSV:</strong> First row should have subject names as headers</li>
            <li>• <strong>PDF:</strong> Make sure text is selectable (not scanned image)</li>
            <li>• <strong>Images:</strong> Take clear, well-lit photos with good contrast</li>
            <li>• Subject names should be recognizable (Math, Science, English, etc.)</li>
            <li>• Scores should be clearly visible numbers (0-100)</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Processing File</h3>
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-600 mt-2">
                Try using a CSV file or a clearer image. Refer to the tips above.
              </p>
            </div>
          </div>
        )}

        {/* Success and Results */}
        {studentData && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">File Processed Successfully!</h3>
                <p className="text-sm text-green-700">
                  Found {studentData.subjects.length} subject{studentData.subjects.length !== 1 ? 's' : ''} for {studentData.name}
                </p>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{studentData.subjects.length}</div>
                <div className="text-sm text-blue-700 font-medium">Total Subjects</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">{studentData.overallPercentage.toFixed(1)}%</div>
                <div className="text-sm text-purple-700 font-medium">Overall Percentage</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-600">{failingSubjects.length + atRiskSubjects.length}</div>
                <div className="text-sm text-orange-700 font-medium">Needs Attention</div>
              </div>
            </div>

            {/* Failing Subjects Alert */}
            {failingSubjects.length > 0 && (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🚨</span>
                  CRITICAL: Subjects You May FAIL
                </h3>
                <p className="text-red-700 mb-4">These subjects need immediate attention!</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {failingSubjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg"
                    >
                      {subject.subjectName}
                    </span>
                  ))}
                </div>
                <div className="bg-red-100 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-900 mb-2">📚 Immediate Actions Required:</p>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Meet with your teacher immediately for extra help</li>
                    <li>• Attend tutoring sessions or extra classes</li>
                    <li>• Study these subjects for at least 2-3 hours daily</li>
                    <li>• Complete all pending assignments and homework</li>
                    <li>• Form study groups with classmates</li>
                  </ul>
                </div>
              </div>
            )}

            {/* At-Risk Subjects Warning */}
            {atRiskSubjects.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  WARNING: At-Risk Subjects
                </h3>
                <p className="text-yellow-700 mb-4">These subjects are below passing but can be improved!</p>
                <div className="flex flex-wrap gap-2">
                  {atRiskSubjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg"
                    >
                      {subject.subjectName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* All Subjects */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Subject-wise Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentData.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${getStatusColor(subject.status)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800 text-lg">{subject.subjectName}</h4>
                      {getStatusBadge(subject.status)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Score:</span>
                        <span className="font-semibold text-gray-800">
                          {subject.score}/{subject.maxScore}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Percentage:</span>
                        <span className="font-semibold text-gray-800">{subject.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Grade:</span>
                        <span className="font-bold text-lg text-gray-900">{subject.grade}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            subject.status === 'FAILING' ? 'bg-red-500' :
                            subject.status === 'AT_RISK' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${subject.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Debug Info (Optional) */}
            {studentData.extractedText && (
              <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-700">
                  🔍 View Extracted Text (for debugging)
                </summary>
                <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap bg-white p-3 rounded border">
                  {studentData.extractedText}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMarksheetSimple;
