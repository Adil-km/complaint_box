
const StatusFilter = ({ statusFilter, setStatusFilter }) => {
  return (
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="w-full sm:w-48 rounded-lg shadow-sm border border-slate-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
    >
      <option value="All">All</option>
      <option value="Pending">Pending</option>
      <option value="Resolved">Resolved</option>
      <option value="Rejected">Rejected</option>
    </select>
  );
};

export default StatusFilter;
