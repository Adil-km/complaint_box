import { Link } from 'react-router-dom';
import { UserPlus, Pencil } from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import { useQuery } from '@tanstack/react-query';

const EmployeeList = () => {

  const {data: employees, isLoading, isError, error } = useQuery({
    queryFn: async ()=> {
      const response = await api.get('/employees');    
      return response.data
    },
    queryKey: ["employees"]
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Employee Directory</h1>
            <p className="text-sm text-slate-500">Manage employee portal credentials</p>
          </div>
          <Link
            to="/admin/employees/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </Link>
        </div>

        {isError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No employees registered yet. Click "Add Employee" to create the first account.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <th className="py-3.5 px-6">Employee ID</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-medium text-slate-900">{emp.employee_id}</td>
                    <td className="py-4 px-6 text-slate-600">{emp.email}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/admin/employees/${emp.id}/edit`}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeList;