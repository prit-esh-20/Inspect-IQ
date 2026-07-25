import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomTable({
  headers = [],
  data = [],
  sortBy,
  order,
  onSort,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onRowClick,
}) {
  return (
    <div className="glass-panel border border-accent/10 rounded-xl overflow-hidden w-full flex flex-col">
      
      {/* Scrollable container */}
      <div className="overflow-x-auto w-full flex-1">
        <table className="w-full text-left border-collapse">
          
          {/* Headings */}
          <thead>
            <tr className="bg-secondary-bg/80 border-b border-accent/10">
              {headers.map((header) => {
                const isSorted = sortBy === header.key;
                return (
                  <th
                    key={header.key}
                    onClick={() => header.sortable && onSort(header.key)}
                    className={`px-6 py-4 font-display text-[10px] uppercase tracking-widest text-slate-400 font-bold select-none ${
                      header.sortable ? "cursor-pointer hover:text-accent transition-colors" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {header.label}
                      {header.sortable && isSorted && (
                        order === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-accent" /> : <ChevronDown className="w-3.5 h-3.5 text-accent" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="divide-y divide-accent/5">
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-accent/[0.03] transition-colors cursor-pointer duration-150 group`}
                >
                  {headers.map((header) => (
                    <td key={header.key} className="px-6 py-3.5 text-xs text-slate-300 font-sans">
                      {header.render ? header.render(row) : row[header.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-xs text-slate-500 font-mono">
                  No records matching search parameters.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-secondary-bg/30 border-t border-accent/5 flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 bg-accent/5 disabled:bg-slate-900 border border-accent/15 disabled:border-slate-800 disabled:text-slate-600 hover:border-accent/50 rounded-lg text-accent transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-accent/5 disabled:bg-slate-900 border border-accent/15 disabled:border-slate-800 disabled:text-slate-600 hover:border-accent/50 rounded-lg text-accent transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
