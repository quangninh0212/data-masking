'use client';

import { useState } from 'react';
import type { ChangeDataPasswordRequest } from '@/types';

type Props = {
  loading?: boolean;
  onSubmit: (payload: ChangeDataPasswordRequest) => Promise<void> | void;
};

export default function ChangeDataPasswordForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<ChangeDataPasswordRequest>({
    oldDataPassword: '',
    newDataPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    setForm({
      oldDataPassword: '',
      newDataPassword: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Password Rotation
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Đổi data password</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Data password cũ
          </label>
          <input
            type="password"
            value={form.oldDataPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, oldDataPassword: e.target.value }))
            }
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Data password mới
          </label>
          <input
            type="password"
            value={form.newDataPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, newDataPassword: e.target.value }))
            }
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none focus:border-sky-400/50"
          />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60"
        >
          {loading ? 'Đang đổi...' : 'Đổi data password'}
        </button>
      </div>
    </form>
  );
}