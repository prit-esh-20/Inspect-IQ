import { Search, Filter, RefreshCw } from "lucide-react";
import { DEFECT_TYPES } from "../../services/mock/mockData";

export default function SearchBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  defectFilter,
  onDefectFilterChange,
  onReset,
}) {
  return (
    <div className="glass-panel border border-accent/10 rounded-xl p-4 flex flex-col lg:flex-row items-center gap-4 w-full">
      
      {/* Text search */}
      <div className="relative w-full lg:flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by PCB ID (e.g. PCB-2026-1015) or model..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#050816]/60 border border-accent/15 rounded-lg font-sans text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:shadow-[0_0_10px_rgba(0,229,255,0.15)] transition-all"
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        
        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-1.5 min-w-[140px] flex-1 lg:flex-none">
          <Filter className="w-3.5 h-3.5 text-accent shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full bg-transparent outline-none border-none text-[11px] font-sans font-semibold tracking-wider text-slate-300 uppercase cursor-pointer"
          >
            <option value="ALL" className="bg-[#111827] text-white">All Statuses</option>
            <option value="PASS" className="bg-[#111827] text-success">PASS</option>
            <option value="FAIL" className="bg-[#111827] text-danger">FAIL</option>
          </select>
        </div>

        {/* Defect Type Filter */}
        <div className="flex items-center gap-2 bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-1.5 min-w-[180px] flex-1 lg:flex-none">
          <Filter className="w-3.5 h-3.5 text-warning shrink-0" />
          <select
            value={defectFilter}
            onChange={(e) => onDefectFilterChange(e.target.value)}
            className="w-full bg-transparent outline-none border-none text-[11px] font-sans font-semibold tracking-wider text-slate-300 uppercase cursor-pointer"
          >
            <option value="ALL" className="bg-[#111827] text-white">All Anomalies</option>
            {Object.entries(DEFECT_TYPES).map(([key, val]) => (
              <option key={key} value={val} className="bg-[#111827] text-white">
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {onReset && (
          <button
            onClick={onReset}
            className="p-2.5 bg-accent/5 hover:bg-accent/15 border border-accent/15 hover:border-accent/40 rounded-lg text-accent hover:text-white transition-all flex items-center gap-1.5 font-display text-[10px] uppercase tracking-wider font-bold cursor-pointer"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}

      </div>
    </div>
  );
}
