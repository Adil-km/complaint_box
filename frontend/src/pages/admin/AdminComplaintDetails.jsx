import { useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('Pending');
  const [remarks, setRemarks] = useState('');;
  const [message, setMessage] = useState({message:"", err:""});
  
  const queryClient = useQueryClient();
  
  const {data: complaint, isLoading, isError, error } = useQuery({
      queryFn: async ()=> {
        const response = await api.get(`/complaints/${id}`);      
          return response.data
        },
      queryKey: ["complaint",id]
    })
    
    const changeComplaint= async({ id, status, remarks})=>{
      const res =  await api.patch(`/complaints/${id}/status`, { status: status, remarks: remarks });
      return res.data
    }
 
    const {mutateAsync: updateComplaint, isPending: isChanging} = useMutation({
    mutationFn: changeComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["complaints"]});
      queryClient.invalidateQueries({queryKey: ["complaint", id]});

      setMessage({
        message: `Status updated!`,
        err: ""
      });
    },

    onError: (err) => {
      setMessage({
        message: "",
        err: err.response?.data?.message || 'Failed to update complaint!'
      });
    }
  })

  useEffect(()=>{
    if(complaint){
      setStatus(complaint.status);
      setRemarks(complaint.remarks || '');
    }
  },[complaint])
  
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

        {isLoading ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-sm text-slate-500">
            Loading complaint...
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

              {message.message && (
                <div className="mb-3 p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium">
                  {message.message}
                </div>
              )}
  
              {message.err && (
                <div className="mb-3 p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium">
                  {message.err}
                </div>
              )}

              <form>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Complaint Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isChanging}
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
                  disabled={isChanging}
                  className="w-full p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                
              <button
                type="button"
                disabled={
                  isChanging || (status === complaint.status && remarks === (complaint.remarks || ''))
                }
                 onClick={async ()=>{
                  if (status === "Rejected" && !remarks.trim()) {
                    setMessage({
                      message: "",
                      err: "Remarks are required when rejecting a complaint!"
                    });
                    return;
                  }

                  setMessage({ message: "", err: "" });
                    try {
                      await updateComplaint({
                        id: complaint.id,
                        status,
                        remarks
                      });
                    } catch (e) {
                      console.log(e);
                    }
                }}
                className="mt-4 w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChanging ? 'Updating Status...' : 'Submit Update'}
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