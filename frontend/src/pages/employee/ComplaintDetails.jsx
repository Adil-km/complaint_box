import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import { useQuery } from '@tanstack/react-query';

const ComplaintDetails = () => {
  const { id } = useParams();

  const {data: complaint, isLoading, isError, error } = useQuery({
    queryFn: async ()=> {
        const response = await api.get(`/complaints/${id}`);      
        return response.data
    },
    queryKey: ["complaint",id]
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link
          to="/employee/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Complaints
        </Link>

        {isLoading ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-sm text-slate-500">
            Loading details...
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{complaint.title}</h1>
                <p className="text-xs text-slate-400">
                  Submitted on {new Date(complaint.created_at).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={complaint.status} />
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Description
              </h2>
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {complaint.remarks &&
            (
              <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 mt-6">
                Remarks
              </h2>
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {complaint.remarks}
              </p>
            </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default ComplaintDetails;