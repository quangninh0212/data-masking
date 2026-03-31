'use client';

import { useEffect, useState } from 'react';
import { FolderLock } from 'lucide-react';
import { fileService } from '@/services/file.service';
import { getErrorMessage } from '@/lib/utils';
import { getDataPassword, setDataPassword } from '@/lib/auth';
import type { FileContentResponse, FileDecryptResponse, FileItem } from '@/types';
import PageTitle from '@/app/components/common/page-title';
import FileUploadForm from '@/app/components/file/file-upload-form';
import Loading from '@/app/components/common/loading';
import FileTable from '@/app/components/file/file-table';
import FileDetailCard from '@/app/components/file/file-detail-card';
import ViewFileContentForm from '@/app/components/file/file-content-form';
import FileContentViewer from '@/app/components/file/file-content-viewer';

function extractDownloadFileName(contentDisposition?: string | null) {
  if (!contentDisposition) return 'download.bin';

  const match =
    contentDisposition.match(/filename\*=UTF-8''([^;]+)/i) ||
    contentDisposition.match(/filename="([^"]+)"/i) ||
    contentDisposition.match(/filename=([^;]+)/i);

  if (!match) return 'download.bin';

  try {
    return decodeURIComponent(match[1].replace(/"/g, '').trim());
  } catch {
    return match[1].replace(/"/g, '').trim();
  }
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [decryptResult, setDecryptResult] = useState<FileDecryptResponse | null>(null);
  const [fileContent, setFileContent] = useState<FileContentResponse | null>(null);
  const [viewContentTarget, setViewContentTarget] = useState<FileItem | null>(null);

  const [loadingList, setLoadingList] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  const [loadingDecryptId, setLoadingDecryptId] = useState<number | null>(null);
  const [loadingViewContentId, setLoadingViewContentId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [dataPassword, setDataPasswordState] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFiles = async () => {
    setLoadingList(true);
    setError('');

    try {
      const response = await fileService.getMyFiles();
      setFiles(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    const saved = getDataPassword();
    if (saved) {
      setDataPasswordState(saved);
    }
    fetchFiles();
  }, []);

  const ensureDataPassword = () => {
    const current = dataPassword || getDataPassword() || '';
    if (!current) {
      throw new Error('Vui lòng nhập data password trước.');
    }
    setDataPassword(current);
    return current;
  };

  const handleUpload = async (file: File, password: string) => {
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fileService.upload(file, password);
      setDataPassword(password);
      setDataPasswordState(password);

      setSuccess(response.data?.message || 'Upload file thành công.');
      setDecryptResult(null);
      setSelectedFile(null);
      setFileContent(null);
      await fetchFiles();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleViewDetail = async (fileId: number) => {
    setLoadingDetailId(fileId);
    setError('');
    setSuccess('');

    try {
      const response = await fileService.getById(fileId);
      setSelectedFile(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingDetailId(null);
    }
  };

  const handleOpenViewContent = (fileId: number) => {
    const target = files.find((item) => item.id === fileId) || null;
    setViewContentTarget(target);
    setFileContent(null);
    setError('');
    setSuccess('');
  };

  const handleSubmitViewContent = async (password: string) => {
    if (!viewContentTarget?.id) return;

    setLoadingViewContentId(viewContentTarget.id);
    setError('');
    setSuccess('');

    try {
      if (!password) {
        throw new Error('Vui lòng nhập data password để xem nội dung file.');
      }

      const response = await fileService.viewContent(viewContentTarget.id, password);
      setFileContent(response.data);
      setDataPassword(password);
      setDataPasswordState(password);
      setSuccess(response.data?.message || 'Xem nội dung file thành công.');
      setViewContentTarget(null);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingViewContentId(null);
    }
  };

  const handleDecrypt = async (fileId: number) => {
    setLoadingDecryptId(fileId);
    setError('');
    setSuccess('');

    try {
      const password = ensureDataPassword();
      const response = await fileService.decrypt(fileId, password);
      setDecryptResult(response.data);
      setSuccess(response.data?.message || 'Giải mã file thành công.');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingDecryptId(null);
    }
  };

  const handleDownload = async (fileId: number) => {
    setDownloadingId(fileId);
    setError('');
    setSuccess('');

    try {
      const password = ensureDataPassword();
      const response = await fileService.download(fileId, password);

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const fileName = extractDownloadFileName(response.headers['content-disposition']);
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess('Tải file thành công.');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (fileId: number) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa file #${fileId} không?`);
    if (!confirmed) return;

    setDeletingId(fileId);
    setError('');
    setSuccess('');

    try {
      const response = await fileService.delete(fileId);
      setSuccess(
        typeof response.data === 'string' ? response.data : 'Xóa file thành công.'
      );

      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      if (fileContent?.fileId === fileId) {
        setFileContent(null);
      }
      if (viewContentTarget?.id === fileId) {
        setViewContentTarget(null);
      }

      setDecryptResult(null);
      await fetchFiles();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Quản lý tệp tin"
        subtitle="Upload, xem nội dung, giải mã, tải xuống và quản trị vòng đời file an toàn."
      />

      <div className="rounded-[28px] border border-violet-400/15 bg-[linear-gradient(135deg,rgba(139,92,246,0.14),rgba(15,23,42,0.62)_42%,rgba(15,23,42,0.94))] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              <FolderLock size={14} />
              Secure File Vault
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">
              Trung tâm tệp tin mã hóa
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Thực hiện upload, xem metadata, mở nội dung, giải mã và tải file với
              data password đã lưu trên trình duyệt.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Data password status
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {dataPassword ? 'Saved in browser' : 'Not available'}
            </p>
          </div>
        </div>
      </div>

      {dataPassword ? (
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-300">
          Đang dùng data password đã lưu trên trình duyệt.
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
          Chưa có data password lưu trên trình duyệt. Upload, xem nội dung, decrypt
          và download sẽ cần nhập password này.
        </div>
      )}

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      ) : null}

      {decryptResult ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          <p className="font-semibold">
            {decryptResult.message || 'Decrypt success'}
          </p>
          <p className="mt-1 break-all text-slate-200">
            Output path: {decryptResult.outputPath}
          </p>
        </div>
      ) : null}

      <FileUploadForm
        loading={uploading}
        defaultDataPassword={dataPassword}
        onSubmit={handleUpload}
      />

      {loadingList ? (
        <Loading />
      ) : (
        <FileTable
          files={files}
          loadingDetailId={loadingDetailId}
          loadingDecryptId={loadingDecryptId}
          loadingViewContentId={loadingViewContentId}
          downloadingId={downloadingId}
          deletingId={deletingId}
          onViewDetail={handleViewDetail}
          onViewContent={handleOpenViewContent}
          onDecrypt={handleDecrypt}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}

      {viewContentTarget ? (
        <ViewFileContentForm
          fileId={viewContentTarget.id}
          fileName={viewContentTarget.originalFileName || viewContentTarget.fileName}
          loading={loadingViewContentId === viewContentTarget.id}
          onSubmit={handleSubmitViewContent}
          onCancel={() => setViewContentTarget(null)}
        />
      ) : null}

      {selectedFile ? <FileDetailCard file={selectedFile} /> : null}
      {fileContent ? <FileContentViewer data={fileContent} /> : null}
    </div>
  );
}