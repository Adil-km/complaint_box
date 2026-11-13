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
  const [remarks, setRemarks] = useState('');
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
        setRemarks(res.data.remarks || '');
      } catch (err) {
        console.log(err);
        setError('Complaint not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault()

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await api.patch(`/complaints/${id}/status`, { status: status, remarks: remarks });
      setStatus(res.data.status);
      setRemarks(res.data.remarks)
      setComplaint({ ...complaint, status: res.data.status, remarks: res.data.remarks });
      setMessage(`Status updated to ${res.data.status}.`);
      
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

              {message && (
                <div className="mb-3 p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium">
                  {message}
                </div>
              )}
  
              {error && (
                <div className="mb-3 p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleStatusUpdate}>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Complaint Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={saving}
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">
                  Remarks
                </label>

                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter your remarks or explanation..."
                  rows={4}
                  disabled={saving}
                  required={status==="Rejected"}
                  className="w-full p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                
              <button
                type="submit"
                disabled={
                  saving ||
                  (status === complaint.status && remarks === (complaint.remarks || ''))
                }
                className="mt-4 w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating Status...' : 'Submit Update'}
              </button>
            </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminComplaintDetails;