import { useState, useEffect } from 'react';
import { User } from './types';
import { storage } from './utils/storage';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';

type AuthView = 'login' | 'register';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');

  useEffect(() => {
    // Check for existing session
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Create demo accounts if they don't exist
    const users = storage.getUsers();
    if (users.length === 0) {
      // Demo student account
      storage.saveUser(
        {
          id: 'demo-student-1',
          email: 'student@demo.com',
          name: 'Alex Johnson',
          role: 'student',
          studentId: 'STU001',
          class: '10',
          section: 'A',
        } as User,
        'demo123'
      );

      // Demo teacher account
      storage.saveUser(
        {
          id: 'demo-teacher-1',
          email: 'teacher@demo.com',
          name: 'Dr. Sarah Smith',
          role: 'teacher',
          teacherId: 'TCH001',
          subject: 'Mathematics',
        } as User,
        'demo123'
      );
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    storage.setCurrentUser(loggedInUser);
  };

  const handleRegister = (newUser: User) => {
    setUser(newUser);
    storage.setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    storage.setCurrentUser(null);
    setAuthView('login');
  };

  // Show login/register
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {authView === 'login' ? (
          <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // Show appropriate dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {user.role === 'student' ? (
        <StudentDashboard user={user} onLogout={handleLogout} />
      ) : (
        <TeacherDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
