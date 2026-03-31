'use client';

import type { AuditLog } from '@/types';
import EmptyState from '../common/empty-state';

type Props = {
  logs: AuditLog[];
  selectedLogId?: number | null;
  onSelect: (logId: number) => void;
};

function ActionBadge({ action }: { action?: string | null }) {
  const value = (action || '-').toUpperCase();

  let style = 'border-white/10 bg-white/5 text-slate-200';

  if (value.includes('CREATE')) {
    style = 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300';
  } else if (value.includes('UPDATE')) {
    style = 'border-sky-400/20 bg-sky-400/10 text-sky-300';
  } else if (value.includes('DELETE')) {
    style = 'border-red-400/20 bg-red-400/10 text-red-300';
  }

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${style}`}>
      {value}
    </span>
  );
}

export default function AuditLogTable({
  logs,
  selectedLogId,
  onSelect,
}: Props) {
  if (!logs.length) {
    return (
      <EmptyState
        title="Chưa có audit log"
        description="Danh sách audit log hiện đang trống."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/[0.04] text-left text-slate-300">
            <tr className="border-b border-white/10">
              <th className="px-4 py-4">ID</th>
              <th className="px-4 py-4">Username</th>
              <th className="px-4 py-4">Action</th>
              <th className="px-4 py-4">Entity</th>
              <th className="px-4 py-4">Entity ID</th>
              <th className="px-4 py-4">Created At</th>
              <th className="px-4 py-4">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className={`border-t border-white/10 transition hover:bg-white/[0.03] ${
                  selectedLogId === log.id ? 'bg-white/[0.04]' : ''
                }`}
              >
                <td className="px-4 py-4 font-mono text-slate-300">{log.id}</td>
                <td className="px-4 py-4 text-white">{log.username || '-'}</td>
                <td className="px-4 py-4">
                  <ActionBadge action={log.action} />
                </td>
                <td className="px-4 py-4">{log.entityName || '-'}</td>
                <td className="px-4 py-4 font-mono text-slate-400">
                  {log.entityId ?? '-'}
                </td>
                <td className="px-4 py-4 font-mono text-slate-400">
                  {log.createdAt || '-'}
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => onSelect(log.id)}
                    className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 px-3 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-400/15"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}