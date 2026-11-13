import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <span className="font-bold text-lg text-slate-900">Complaint Box</span>
          {user.role === 'Admin' ? (
            <div className="flex space-x-4 text-sm font-medium">
              <Link to="/admin/dashboard" className="text-slate-600 hover:text-blue-600 hover:underline underline-offset-8 transition-all ease-out duration-100 hover:underline-offset-4">
                All Complaints
              </Link>
              <Link to="/admin/employees" className="text-slate-600 hover:text-blue-600 hover:underline underline-offset-8 transition-all ease-out duration-100 hover:underline-offset-4">
                Employees
              </Link>
            </div>
          ) : (
            <div className="flex space-x-4 text-sm font-medium">
              <Link to="/employee/dashboard" className="text-slate-600 hover:text-blue-600 hover:underline underline-offset-8 transition-all ease-out duration-100 hover:underline-offset-4">
                My Complaints
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-slate-500 hidden sm:inline">
            {user.email} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;