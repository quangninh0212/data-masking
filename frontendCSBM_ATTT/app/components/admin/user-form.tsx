'use client';

import { useState } from 'react';
import type { User, UserCreateRequest, UserUpdateRequest } from '@/types';

type Props = {
  mode: 'create' | 'update';
  initialData?: User | null;
  loading?: boolean;
  onSubmit: (payload: UserCreateRequest | UserUpdateRequest) => Promise<void> | void;
};

const ROLE_OPTIONS = ['ADMIN', 'EMPLOYEE', 'USER'];

export default function UserForm({
  mode,
  initialData,
  loading,
  onSubmit,
}: Props) {
  const [username, setUsername] = useState(initialData?.username || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialData?.role || 'USER');
  const [active, setActive] = useState<boolean>(initialData?.active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      const payload: UserCreateRequest = {
        username,
        password,
        role,
      };
      await onSubmit(payload);
      return;
    }

    const payload: UserUpdateRequest = {
      username,
      role,
      active,
    };
    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          User Form
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          {mode === 'create' ? 'Tạo user mới' : 'Cập nhật user'}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/50"
            placeholder="Nhập username"
          />
        </div>

        {mode === 'create' ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/50"
              placeholder="Nhập password"
            />
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none"
          >
            {ROLE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {mode === 'update' ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Trạng thái
            </label>
            <select
              value={active ? 'true' : 'false'}
              onChange={(e) => setActive(e.target.value === 'true')}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        ) : null}
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
        >
          {loading
            ? 'Đang xử lý...'
            : mode === 'create'
            ? 'Tạo user'
            : 'Cập nhật user'}
        </button>
      </div>
    </form>
  );
}