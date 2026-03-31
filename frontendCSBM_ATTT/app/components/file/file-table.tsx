'use client';

import type { FileItem } from '@/types';
import EmptyState from '../common/empty-state';

type Props = {
  files: FileItem[];
  loadingDetailId?: number | null;
  loadingDecryptId?: number | null;
  loadingViewContentId?: number | null;
  downloadingId?: number | null;
  deletingId?: number | null;
  onViewDetail: (fileId: number) => void;
  onViewContent: (fileId: number) => void;
  onDecrypt: (fileId: number) => void;
  onDownload: (fileId: number) => void;
  onDelete: (fileId: number) => void;
};

function getDisplayName(file: FileItem) {
  return file.originalFileName || file.fileName || `File #${file.id}`;
}

function Badge({
  label,
  tone = 'default',
}: {
  label: string;
  tone?: 'default' | 'success';
}) {
  const styles = {
    default: 'border-white/10 bg-white/5 text-slate-200',
    success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[tone]}`}>
      {label}
    </span>
  );
}

export default function FileTable({
  files,
  loadingDetailId,
  loadingDecryptId,
  loadingViewContentId,
  downloadingId,
  deletingId,
  onViewDetail,
  onViewContent,
  onDecrypt,
  onDownload,
  onDelete,
}: Props) {
  if (!files.length) {
    return (
      <EmptyState
        title="Chưa có file"
        description="Bạn chưa upload file nào hoặc danh sách đang trống."
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
              <th className="px-4 py-4">Tên file gốc</th>
              <th className="px-4 py-4">Tên file lưu</th>
              <th className="px-4 py-4">Đường dẫn lưu</th>
              <th className="px-4 py-4">Mã hóa</th>
              <th className="px-4 py-4">Ngày tạo</th>
              <th className="px-4 py-4">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file) => (
              <tr
                key={file.id}
                className="border-t border-white/10 align-top text-slate-300 transition hover:bg-white/[0.03]"
              >
                <td className="px-4 py-4">{file.id}</td>
                <td className="px-4 py-4 text-white">{getDisplayName(file)}</td>
                <td className="px-4 py-4">{file.fileName || '-'}</td>
                <td className="px-4 py-4 break-all text-xs text-slate-500">
                  {file.storedPath || '-'}
                </td>
                <td className="px-4 py-4">
                  {file.isEncrypted ? (
                    <Badge label="Encrypted" tone="success" />
                  ) : (
                    <Badge label="Plain file" />
                  )}
                </td>
                <td className="px-4 py-4">{file.createdAt || '-'}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onViewDetail(file.id)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      {loadingDetailId === file.id ? 'Đang tải...' : 'Chi tiết'}
                    </button>

                    <button
                      onClick={() => onViewContent(file.id)}
                      className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-400/15"
                    >
                      {loadingViewContentId === file.id ? 'Đang xem...' : 'Nội dung'}
                    </button>

                    <button
                      onClick={() => onDecrypt(file.id)}
                      className="rounded-2xl bg-violet-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-400"
                    >
                      {loadingDecryptId === file.id ? 'Đang giải mã...' : 'Decrypt'}
                    </button>

                    <button
                      onClick={() => onDownload(file.id)}
                      className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/15"
                    >
                      {downloadingId === file.id ? 'Đang tải...' : 'Download'}
                    </button>

                    <button
                      onClick={() => onDelete(file.id)}
                      className="rounded-2xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/15"
                    >
                      {deletingId === file.id ? 'Đang xóa...' : 'Xóa'}
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