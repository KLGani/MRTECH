import React, { useState } from 'react';
import { Upload, FileText, Image, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { 
  processMarksheetFile, 
  ParsedStudentData,
  SubjectScore 
} from '../../utils/fileProcessingFixed';

const UploadMarksheetEnhanced: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<EnhancedStudentData | null>(null);
  const [analysis, setAnalysis] = useState<SubjectAnalysis | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setStudentData(null);
    setAnalysis(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Process the file
      const data = await processMarksheetFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);

      // Analyze subject performance
      const performanceAnalysis = analyzeSubjectPerformance(data.subjects);

      setStudentData(data);
      setAnalysis(performanceAnalysis);

      // Save to localStorage
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const history = JSON.parse(localStorage.getItem(`predictions_${user.email}`) || '[]');
      
      history.push({
        timestamp: new Date().toISOString(),
        studentData: data,
        analysis: performanceAnalysis
      });
      
      localStorage.setItem(`predictions_${user.email}`, JSON.stringify(history));

    } catch (err) {
      setError((err as Error).message || 'Failed to process file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage < 40) return 'text-red-600 bg-red-50 border-red-200';
    if (percentage < 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (percentage < 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Upload className="text-blue-500" size={24} />
          Upload Your Marksheet
        </h2>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".csv,.pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="marksheet-upload"
            />
            <label
              htmlFor="marksheet-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              {uploading ? (
                <Loader className="text-blue-500 animate-spin" size={48} />
              ) : (
                <>
                  <FileText className="text-gray-400" size={48} />
                  <Image className="text-gray-400" size={48} />
                </>
              )}
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {uploading ? 'Processing...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports: CSV, PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            </label>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📝 Instructions:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Upload a clear photo of your marksheet or report card</li>
              <li>• Ensure all subject names and scores are clearly visible</li>
              <li>• AI will automatically extract subject-wise scores</li>
              <li>• System will identify subjects where you may fail</li>
              <li>• Get personalized recommendations for improvement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="font-semibold text-red-800">Upload Failed</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <p className="text-sm text-red-600 mt-2">
              💡 Try: Take a clear, well-lit photo with all subjects and scores visible, 
              or use a CSV file with subject names as column headers.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {studentData && analysis && (
        <div className="space-y-6">
          {/* Student Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{studentData.name}</h3>
                <p className="text-gray-600">Student ID: {studentData.studentId}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  {analysis.overallPercentage.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Overall Percentage</p>
              </div>
            </div>
            
            {studentData.attendance && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Attendance: <span className="font-semibold text-gray-800">{studentData.attendance}%</span>
                </p>
              </div>
            )}
          </div>

          {/* FAILING SUBJECTS ALERT */}
          {analysis.failingSubjects.length > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-600" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-red-800">
                    🚨 CRITICAL: Subjects You May FAIL
                  </h3>
                  <p className="text-sm text-red-600">These subjects need immediate attention!</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.failingSubjects.map((subject, index) => (
                  <div key={index} className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
                    {subject.subjectName} - {((subject.score / subject.maxScore) * 100).toFixed(0)}%
                  </div>
                ))}
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">📚 Urgent Action Required:</h4>
                <ul className="space-y-1 text-sm text-red-700">
                  {analysis.failingSubjects.map((subject, index) => (
                    <li key={index}>
                      • <strong>{subject.subjectName}:</strong> Attend extra classes, seek teacher help immediately, practice daily
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* AT-RISK SUBJECTS ALERT */}
          {analysis.atRiskSubjects.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-yellow-600" size={28} />
                <div>
                  <h3 className="text-lg font-bold text-yellow-800">
                    ⚠️ WARNING: At-Risk Subjects
                  </h3>
                  <p className="text-sm text-yellow-600">Need improvement to avoid failure</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {analysis.atRiskSubjects.map((subject, index) => (
                  <div key={index} className="bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                    {subject.subjectName} - {((subject.score / subject.maxScore) * 100).toFixed(0)}%
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Subjects List */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              Subject-Wise Performance
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentData.subjects.map((subject, index) => {
                const percentage = (subject.score / subject.maxScore) * 100;
                return (
                  <div 
                    key={index} 
                    className={`border-2 rounded-lg p-4 ${getScoreColor(percentage)}`}
                  >
                    <h4 className="font-semibold text-lg mb-2">{subject.subjectName}</h4>
                    <div className="space-y-1">
                      <p className="text-sm">
                        Score: <span className="font-bold">{subject.score}/{subject.maxScore}</span>
                      </p>
                      <p className="text-sm">
                        Percentage: <span className="font-bold">{percentage.toFixed(1)}%</span>
                      </p>
                      <p className="text-sm">
                        Grade: <span className="font-bold text-lg">{subject.grade}</span>
                      </p>
                    </div>
                    {percentage < 40 && (
                      <div className="mt-2 pt-2 border-t border-current">
                        <p className="text-xs font-semibold">❌ FAILING</p>
                      </div>
                    )}
                    {percentage >= 40 && percentage < 50 && (
                      <div className="mt-2 pt-2 border-t border-current">
                        <p className="text-xs font-semibold">⚠️ AT RISK</p>
                      </div>
                    )}
                    {percentage >= 50 && (
                      <div className="mt-2 pt-2 border-t border-current">
                        <p className="text-xs font-semibold">✅ PASSING</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              💡 Personalized Recommendations
            </h3>
            
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-white rounded-lg p-3 text-sm text-gray-700">
                  {recommendation}
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Text Debug (Optional) */}
          {studentData.extractedText && (
            <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <summary className="cursor-pointer font-semibold text-gray-700">
                🔍 View Extracted Text (Debug)
              </summary>
              <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                {studentData.extractedText}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadMarksheetEnhanced;
