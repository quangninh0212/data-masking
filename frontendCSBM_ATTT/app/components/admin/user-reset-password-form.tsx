'use client';

import { useState } from 'react';

type Props = {
  loading?: boolean;
  onSubmit: (newPassword: string) => Promise<void> | void;
};

export default function ResetPasswordForm({ loading, onSubmit }: Props) {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newPassword);
    setNewPassword('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Recovery
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Reset password</h2>
      </div>

      <div className="max-w-md">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Mật khẩu mới
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/50"
          placeholder="Nhập mật khẩu mới"
        />
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-5 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-400/15 disabled:opacity-60"
        >
          {loading ? 'Đang reset...' : 'Reset password'}
        </button>
      </div>
    </form>
  );
}