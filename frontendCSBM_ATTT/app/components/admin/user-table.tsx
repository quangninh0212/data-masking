'use client';

import type { User } from '@/types';
import EmptyState from '../common/empty-state';

type Props = {
  users: User[];
  selectedUserId?: number | null;
  deletingId?: number | null;
  onSelect: (userId: number) => void;
  onDelete: (userId: number) => void;
};

function Badge({
  label,
  tone = 'default',
}: {
  label: string;
  tone?: 'default' | 'success' | 'danger' | 'violet';
}) {
  const styles = {
    default: 'border-white/10 bg-white/5 text-slate-200',
    success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    danger: 'border-red-400/20 bg-red-400/10 text-red-300',
    violet: 'border-violet-400/20 bg-violet-400/10 text-violet-300',
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[tone]}`}>
      {label}
    </span>
  );
}

export default function UserTable({
  users,
  selectedUserId,
  deletingId,
  onSelect,
  onDelete,
}: Props) {
  if (!users.length) {
    return (
      <EmptyState
        title="Chưa có user"
        description="Danh sách user hiện đang trống."
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
              <th className="px-4 py-4">Role</th>
              <th className="px-4 py-4">Active</th>
              <th className="px-4 py-4">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-t border-white/10 transition hover:bg-white/[0.03] ${
                  selectedUserId === user.id ? 'bg-white/[0.04]' : ''
                }`}
              >
                <td className="px-4 py-4">{user.id}</td>
                <td className="px-4 py-4 text-white">{user.username}</td>
                <td className="px-4 py-4">
                  <Badge
                    label={user.role || '-'}
                    tone={user.role === 'ADMIN' ? 'violet' : 'default'}
                  />
                </td>
                <td className="px-4 py-4">
                  {user.active ? (
                    <Badge label="Active" tone="success" />
                  ) : (
                    <Badge label="Inactive" tone="danger" />
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onSelect(user.id)}
                      className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-400/15"
                    >
                      Chi tiết / Sửa
                    </button>

                    <button
                      onClick={() => onDelete(user.id)}
                      className="rounded-2xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/15"
                    >
                      {deletingId === user.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}