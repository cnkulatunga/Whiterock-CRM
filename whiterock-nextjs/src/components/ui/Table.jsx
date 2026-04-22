'use client';
import { clsx } from 'clsx';

export function Table({ columns, data, loading, emptyMessage = 'No records found', onRowClick }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface border-b border-surface-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'px-3 py-2.5 text-left text-[8px] font-black text-subtle uppercase tracking-[.08em] whitespace-nowrap',
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-[10px] text-muted font-semibold">
                <i className="fas fa-inbox text-2xl text-surface-border mb-2 block" />
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'border-b border-surface-border last:border-0',
                  'transition-colors duration-100',
                  onRowClick && 'cursor-pointer hover:bg-surface'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx('px-3 py-2.5 text-[10px] font-medium text-navy-700', col.cellClassName)}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, total, pageSize = 20, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
      <p className="text-[9px] font-semibold text-muted">
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] text-subtle hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fas fa-chevron-left" />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={clsx(
              'w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold',
              p === page ? 'bg-navy text-white' : 'text-subtle hover:bg-surface'
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] text-subtle hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}
