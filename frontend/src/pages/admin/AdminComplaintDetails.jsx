import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        setComplaint(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.log(err);
        setError('Complaint not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await api.patch(`/complaints/${id}/status`, { status: newStatus });
      setStatus(res.data.status);
      setComplaint({ ...complaint, status: res.data.status });
      setMessage(`Status updated to ${newStatus}.`);
    } catch (err) {
        console.log(err);
      setError('Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Complaints
        </Link>

        {loading ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-sm text-slate-500">
            Loading complaint...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{complaint.title}</h1>
                <p className="text-sm text-slate-500">
                  Submitted by <span className="font-medium text-slate-700">{complaint.submitted_by}</span> ({complaint.employee_id}) on{' '}
                  {new Date(complaint.created_at).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={complaint.status} />
            </div>

            <div className="mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Description
              </h2>
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {complaint.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Update Resolution Status
              </label>

              {message && (
                <div className="mb-3 p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium">
                  {message}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {['Pending', 'Resolved', 'Rejected'].map((option) => (
                  <button
                    key={option}
                    disabled={saving || status === option}
                    onClick={() => handleStatusUpdate(option)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                      status === option
                        ? 'bg-slate-900 text-white border-slate-900 cursor-default'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    } disabled:opacity-60`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminComplaintDetails;