import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/youth/DashboardPage';
import NotificationsPage from './pages/youth/NotificationsPage';
import ProfilePage from './pages/youth/ProfilePage';
import SettingsPage from './pages/youth/settings/SettingsPage';
import ChangePassword from './pages/youth/settings/ChangePassword';
import EmailPreferences from './pages/youth/settings/EmailPreferences';
import JobsPage from './pages/youth/JobsPage';
import ApplicationsPage from './pages/youth/ApplicationsPage';
import TrainingPage from './pages/youth/TrainingPage';
import OpportunitiesPage from './pages/youth/OpportunitiesPage';
import GroupsPage from './pages/youth/GroupsPage';
import EmployerDashboardPage from './pages/employer/DashboardPage';
import EmployerProfiles from './pages/employer/EmployerProfiles';
import AdminDashboard from './pages/admin/AdminDashboard';
import YouthLayout from './components/youth/YouthLayout';
import EmployerLayout from './components/employer/EmployerLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Youth Routes */}
          <Route path="/youth" element={
            <ProtectedRoute roles={['youth']}>
              <YouthLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />}>
              <Route index element={<Navigate to="change-password" replace />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="email-preferences" element={<EmailPreferences />} />
            </Route>
            <Route path="jobs" element={<JobsPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="trainings" element={<TrainingPage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="groups" element={<GroupsPage />} />
            {/* Add other youth routes here */}
          </Route>
          
          {/* Employer Routes */}
          <Route 
            path="/employer" 
            element={
              <ProtectedRoute roles={['employer']}>
                <EmployerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployerDashboardPage />} />
            <Route path="profile" element={<EmployerProfiles />} />
          </Route>
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to appropriate dashboard based on role */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {({ user }) => {
                  if (user.role === 'admin') return <Navigate to="/admin" replace />;
                  if (user.role === 'employer') return <Navigate to="/employer/dashboard" replace />;
                  return <Navigate to="/youth/dashboard" replace />;
                }}
              </ProtectedRoute>
            } 
          />
          
          {/* 404 - Not Found */}
          <Route 
            path="*" 
            element={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800">404</h1>
                  <p className="text-gray-600 mt-2">Page not found</p>
                  <Link 
                    to="/" 
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Go back home
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
