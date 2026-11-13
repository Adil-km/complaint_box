const SearchBar = ({ search, setSearch, placeholder }) => {
  return (
    <input
      type="text"
      placeholder={placeholder || 'Search...'}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full min-w-0 rounded-lg shadow-sm border border-slate-300 px-4 py-2.5 text-sm focus:outline-none bg-white focus:ring-1 focus:ring-slate-900"
    />
  );
};

export default SearchBar;