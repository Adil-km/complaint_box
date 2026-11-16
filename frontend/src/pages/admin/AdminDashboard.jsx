import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import StatusFilter from '../../components/StatusFilter';
import SearchBar from '../../components/SearchBar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const AdminDashboard = () => {

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();

  const searchFields = ['title', 'submitted_by', 'employee_id'];


  const queryClient = useQueryClient();

  const {data: complaint, isLoading, isError, error } = useQuery({
    queryFn: async ()=> {
      const response = await api.get('/complaints')      
      return response.data
    },
    queryKey: ["complaints"]
  })


  const deleteComplaint= async({id})=>{
    const res = await api.delete(`/complaints/${id}`);
    return res.data;
  }

  const {mutateAsync: removeComplaint, isPending: isDeleting} = useMutation({
    mutationFn: deleteComplaint,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ["complaints"]});
    },
    onError: (err)=>{
      console.log(err.response?.data?.message || 'Failed to delete complaint.');
    }
  })

  const complaints = complaint ?? [];

  const filteredComplaints = complaints.filter((item) => {
    const matchesSearch = searchFields.some((field) =>
      String(item[field] || '')
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

        {isError && (
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
          {isLoading ? (
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
                          disabled={isDeleting}
                          onClick={async (e) => {
                            e.stopPropagation();

                            if (!window.confirm('Delete this complaint?')) return;

                            try {
                              await removeComplaint({ id: item.id });
                            } catch (err) {
                              console.log(err);
                            }
                          }}
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