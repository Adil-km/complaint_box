
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import StatusFilter from '../../components/StatusFilter';
import SearchBar from '../../components/SearchBar';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();

  const searchFields = ['title', 'submitted_by', 'employee_id'];

  useEffect(() => {
    const fetchAllComplaints = async () => {
      try {
        const res = await api.get('/complaints');
        setComplaints(res.data);
      } catch (err) {
        console.log(err);
        setError('Failed to load organization complaints.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllComplaints();
  }, []);

  const filteredComplaints = complaints.filter((item) => {
    const matchesSearch = searchFields.some((field) =>
      String(item[field] || '')
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    const matchesStatus =
      statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    if (!window.confirm('Permanently delete this complaint?')) return;

    try {
      await api.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.log(err);
      alert('Failed to delete complaint.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            All Organization Complaints
          </h1>
          <p className="text-sm text-slate-500">
            Review, update resolution statuses, or remove entries
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="my-5 flex flex-row gap-2">
          <SearchBar
            search={search}
            setSearch={setSearch}
            placeholder="Search by title, employee name, or ID..."
          />

          <StatusFilter
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Loading complaints...
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No complaints have been submitted across the organization yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <th className="py-3.5 px-6">Complaint Title</th>
                  <th className="py-3.5 px-6">Submitted By</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">
                      No matching complaints found.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() =>
                        navigate(`/admin/complaints/${item.id}`)
                      }
                      className="cursor-pointer hover:bg-slate-50 transition"
                    >
                      <td className="py-4 px-6 font-medium text-slate-900">
                        {item.title}
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        {item.submitted_by}{' '}
                        <span className="text-xs text-slate-400">
                          ({item.employee_id})
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;