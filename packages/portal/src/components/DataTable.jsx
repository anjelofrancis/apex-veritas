import React from 'react';
import { apiErrorMessage } from '../api/client';

export default function DataTable({ columns, data, isLoading, isError, error, emptyMessage, onRowClick }) {
  if (isLoading) {
    return (
      <div className="glass-card bg-surface/50 overflow-hidden">
        <div className="p-4 flex flex-col gap-3">
          <div className="h-4 bg-white/5 animate-pulse rounded w-full"></div>
          <div className="h-4 bg-white/5 animate-pulse rounded w-full"></div>
          <div className="h-4 bg-white/5 animate-pulse rounded w-full"></div>
        </div>
      </div>
    );
  }

  // A failed fetch must not fall through to the empty state below — "no
  // records found" would report an outage as a legitimately empty table.
  if (isError) {
    return (
      <div className="glass-card bg-surface/50 border border-oxide/30 p-8 text-center" role="alert">
        <p className="font-mono text-[11px] uppercase tracking-widest text-oxide">
          Could not load records
        </p>
        <p className="mt-2 text-sm text-text-secondary">{apiErrorMessage(error)}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-card bg-surface/50 p-8 text-center text-text-muted">
        {emptyMessage || 'No records found'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto glass-card bg-surface/50">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-divider bg-white/5">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-text-secondary font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick && onRowClick(row)}
              className={`border-b border-divider last:border-0 hover:bg-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, j) => (
                <td key={j} className="px-4 py-3 text-sm text-text-primary">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
