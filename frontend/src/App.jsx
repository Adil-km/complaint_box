import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ComplaintDetails from './pages/employee/ComplaintDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaintDetails from './pages/admin/AdminComplaintDetails';
import EmployeeList from './pages/admin/EmployeeList';
import CreateEmployee from './pages/admin/CreateEmployee';
import EditEmployee from './pages/admin/EditEmployee';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Employee Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/complaints/:id" element={<ComplaintDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/complaints/:id" element={<AdminComplaintDetails />} />
            <Route path="/admin/employees" element={<EmployeeList />} />
            <Route path="/admin/employees/new" element={<CreateEmployee />} />
            <Route path="/admin/employees/:id/edit" element={<EditEmployee />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;