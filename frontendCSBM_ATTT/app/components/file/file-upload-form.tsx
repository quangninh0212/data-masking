'use client';

import { useState } from 'react';

type Props = {
  loading?: boolean;
  defaultDataPassword?: string;
  onSubmit: (file: File, dataPassword: string) => Promise<void> | void;
};

const ALLOWED_EXTENSIONS = ['.txt', '.json', '.csv', '.xml', '.md'];

function hasAllowedExtension(fileName: string) {
  const lower = fileName.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export default function FileUploadForm({
  loading,
  defaultDataPassword = '',
  onSubmit,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataPassword, setDataPassword] = useState(defaultDataPassword);
  const [error, setError] = useState('');

  const handleFileChange = (file: File | null) => {
    setError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!hasAllowedExtension(file.name)) {
      setSelectedFile(null);
      setError('Chỉ được upload file .txt, .json, .csv, .xml, .md');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Vui lòng chọn file.');
      return;
    }

    if (!hasAllowedExtension(selectedFile.name)) {
      setError('Chỉ được upload file .txt, .json, .csv, .xml, .md');
      return;
    }

    if (!dataPassword) {
      setError('Vui lòng nhập data password.');
      return;
    }

    await onSubmit(selectedFile, dataPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Upload
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Upload file mã hóa
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Chọn file
          </label>
          <input
            type="file"
            accept=".txt,.json,.csv,.xml,.md,text/plain,application/json,text/csv,application/xml,text/xml,text/markdown"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-200"
          />
          <p className="mt-2 text-xs text-slate-500">
            Chỉ hỗ trợ: .txt, .json, .csv, .xml, .md
          </p>
          {selectedFile ? (
            <p className="mt-2 text-sm font-medium text-slate-300">
              {selectedFile.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Data password
          </label>
          <input
            type="password"
            value={dataPassword}
            onChange={(e) => setDataPassword(e.target.value)}
            placeholder="Nhập data password để mã hóa file"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-400/50"
          />
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60"
        >
          {loading ? 'Đang upload...' : 'Upload file'}
        </button>
      </div>
    </form>
  );
}