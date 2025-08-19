import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, Admin {user.firstName || ''}!</h2>
          <p className="text-gray-600">Manage the platform from this admin panel.</p>
          
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder cards for admin features */}
            <div className="bg-red-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
                <p className="mt-2 text-sm text-gray-500">Manage all users and permissions</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Job Listings</h3>
                <p className="mt-2 text-sm text-gray-500">Manage all job postings</p>
              </div>
            </div>
            
            <div className="bg-green-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Reports</h3>
                <p className="mt-2 text-sm text-gray-500">View system reports and analytics</p>
              </div>
            </div>

            <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Settings</h3>
                <p className="mt-2 text-sm text-gray-500">Configure platform settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
