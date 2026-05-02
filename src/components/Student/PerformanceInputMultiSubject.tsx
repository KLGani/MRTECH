import { useState } from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { StudentPerformance, SubjectScore } from '../../types';
import { predictPerformanceWithSubjects } from '../../utils/subjectPrediction';
import { savePerformanceData } from '../../utils/storage';

interface Props {
  user: { id: string; name: string; email: string };
  onPredictionComplete: (prediction: any) => void;
}

const DEFAULT_SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'];

export default function PerformanceInputMultiSubject({ user, onPredictionComplete }: Props) {
  const [attendance, setAttendance] = useState(85);
  const [studyHours, setStudyHours] = useState(4);
  const [extracurricular, setExtracurricular] = useState(2);
  
  const [subjects, setSubjects] = useState<SubjectScore[]>([
    { subjectName: 'Mathematics', assignmentScore: 0, quizScore: 0, midtermScore: 0, previousResult: 0 }
  ]);

  const addSubject = () => {
    const nextSubject = DEFAULT_SUBJECTS.find(s => !subjects.some(sub => sub.subjectName === s)) || `Subject ${subjects.length + 1}`;
    setSubjects([
      ...subjects,
      { subjectName: nextSubject, assignmentScore: 0, quizScore: 0, midtermScore: 0, previousResult: 0 }
    ]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const updateSubject = (index: number, field: keyof SubjectScore, value: string | number) => {
    const updated = [...subjects];
    if (field === 'subjectName') {
      updated[index].subjectName = value as string;
    } else if (field === 'assignmentScore') {
      updated[index].assignmentScore = Number(value);
    } else if (field === 'quizScore') {
      updated[index].quizScore = Number(value);
    } else if (field === 'midtermScore') {
      updated[index].midtermScore = Number(value);
    } else if (field === 'previousResult') {
      updated[index].previousResult = Number(value);
    }
    setSubjects(updated);
  };

  const handlePredict = () => {
    const performance: StudentPerformance = {
      studentId: user.id,
      studentName: user.name,
      email: user.email,
      class: '10',
      section: 'A',
      attendance,
      studyHoursPerDay: studyHours,
      extracurricularActivities: extracurricular,
      subjects,
      timestamp: new Date().toISOString()
    };

    const prediction = predictPerformanceWithSubjects(performance);
    savePerformanceData(performance, prediction);
    onPredictionComplete({ performance, prediction });
  };

  return (
    <div className="space-y-6">
      {/* General Information */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="text-blue-600" />
          General Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attendance (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={attendance}
              onChange={(e) => setAttendance(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Study Hours/Day
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Extracurricular Activities
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={extracurricular}
              onChange={(e) => setExtracurricular(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Subject-wise Scores</h2>
          <button
            onClick={addSubject}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Subject
          </button>
        </div>

        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 relative">
              {subjects.length > 1 && (
                <button
                  onClick={() => removeSubject(index)}
                  className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject Name
                  </label>
                  <select
                    value={subject.subjectName}
                    onChange={(e) => updateSubject(index, 'subjectName', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    {DEFAULT_SUBJECTS.map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Economics">Economics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assignment Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={subject.assignmentScore}
                    onChange={(e) => updateSubject(index, 'assignmentScore', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quiz Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={subject.quizScore}
                    onChange={(e) => updateSubject(index, 'quizScore', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Midterm Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={subject.midtermScore}
                    onChange={(e) => updateSubject(index, 'midtermScore', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Previous Result
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={subject.previousResult}
                    onChange={(e) => updateSubject(index, 'previousResult', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predict Button */}
      <div className="flex justify-center">
        <button
          onClick={handlePredict}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
        >
          🔮 Predict Performance
        </button>
      </div>
    </div>
  );
}
