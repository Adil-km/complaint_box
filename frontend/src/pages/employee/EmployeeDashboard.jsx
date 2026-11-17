import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import StatusFilter from '../../components/StatusFilter';
import SearchBar from '../../components/SearchBar';
import ChatBotBox from '../../components/ChatBotBox';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const EmployeeDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();

  const searchFields = ['title'];
  
  const queryClient = useQueryClient();
  
  const {data: complaint, isLoading, isError, error } = useQuery({
    queryFn: async ()=> {
      const response = await api.get('/complaints')      
      return response.data
    },
    queryKey: ["complaints"]
  })

  const addComplaint= async({ title, description })=>{
      const res = await api.post('/complaints', { title, description });
      return res.data
  }
 
  const {mutateAsync: newComplaint, isPending: isAdding} = useMutation({
    mutationFn: addComplaint,
    onSuccess: ()=>{
      queryClient.invalidateQueries(["complaints"])
      setShowModal(false);
      setTitle("");
      setDescription("");
    },
    onError: (err)=>{
        console.log(err.response?.data?.message || 'Failed to submit complaint.');
      }
  })
    
  const deleteComplaint= async({id})=>{
    const res = await api.delete(`/complaints/${id}`);
    return res.data;
  }

  const {mutateAsync: removeComplaint, isPending: isDeleting} = useMutation({
    mutationFn: deleteComplaint,
    onSuccess: ()=>{
      queryClient.invalidateQueries(["complaints"])
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

    const matchesStatus =
    statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
    
  });
  
  if(isLoading) return <p>Data is loading</p>  
  
  return (
    
    <div className="min-h-screen bg-slate-50">
      <ChatBotBox/>

      
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
            <p className="text-sm text-slate-500">Track and manage your submitted workplace issues</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            New Complaint
          </button>
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
            placeholder="Search by title..."
          />
          
           <StatusFilter
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            />

        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading complaints...</div>
          ) : complaint.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              You haven&apos;t submitted any complaints yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <th className="py-3.5 px-6">Complaint Title</th>
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
                    onClick={() => navigate(`/complaints/${item.id}`)}
                    className={`cursor-pointer transition ${
                      item.status === 'Pending' ? 'bg-amber-50/40 hover:bg-amber-50/80' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-4 px-6 font-medium text-slate-900">{item.title}</td>
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
                        title="Delete complaint"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? 'Deleting': 'Delete'}
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      



      {/* New Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Raise a New Complaint</h2>
              <button onClick={() => {
                  setShowModal(false);
                  setTitle("");
                  setDescription("");
                }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* <form onSubmit={handleCreate} className="space-y-4"> */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of the issue"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows="4"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide full details..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setTitle("");
                    setDescription("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={async ()=>{
                    try {
                      await newComplaint({title, description})
                      setTitle("")
                      setDescription("")
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                  type="button"
                  disabled={isAdding}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                >
                  {isAdding ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

  );
};

export default EmployeeDashboard;