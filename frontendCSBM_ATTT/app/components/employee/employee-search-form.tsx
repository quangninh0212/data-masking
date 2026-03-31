'use client';

import { useState } from 'react';
import type { EmployeeSearchRequest } from '@/types';

type Props = {
  loading?: boolean;
  onSearch: (values: EmployeeSearchRequest) => void;
  onReset: () => void;
};

const initialValues: EmployeeSearchRequest = {
  code: '',
  name: '',
  gender: '',
  type: '',
  level: '',
  education: '',
  graduationYear: '',
};

export default function EmployeeSearchForm({
  loading,
  onSearch,
  onReset,
}: Props) {
  const [form, setForm] = useState<EmployeeSearchRequest>(initialValues);

  const handleChange = (key: keyof EmployeeSearchRequest, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleaned: EmployeeSearchRequest = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value && String(value).trim() !== '') {
        cleaned[key as keyof EmployeeSearchRequest] = value;
      }
    });

    onSearch(cleaned);
  };

  const handleReset = () => {
    setForm(initialValues);
    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Filters
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Bộ lọc tìm kiếm nhân viên
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Mã nhân viên
          </label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            value={form.code || ''}
            onChange={(e) => handleChange('code', e.target.value)}
            placeholder="VD: NV001"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Tên
          </label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            value={form.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nhập tên"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Giới tính
          </label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            value={form.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            placeholder="Nam / Nữ"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Loại
          </label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            value={form.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            placeholder="Intern / Official"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Level
          </label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            value={form.level || ''}
            onChange={(e) => handleChange('level', e.target.value)}
            placeholder="Junior / Senior"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Học vấn
          </label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            value={form.education || ''}
            onChange={(e) => handleChange('education', e.target.value)}
            placeholder="Đại học..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Năm tốt nghiệp
          </label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            value={form.graduationYear || ''}
            onChange={(e) => handleChange('graduationYear', e.target.value)}
            placeholder="2024"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Đặt lại
        </button>
      </div>
    </form>
  );
}