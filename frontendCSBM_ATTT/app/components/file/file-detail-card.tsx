import type { FileItem } from '@/types';

type Props = {
  file: FileItem;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm text-slate-200">
        {value === true ? 'Có' : value === false ? 'Không' : value || '-'}
      </p>
    </div>
  );
}

export default function FileDetailCard({ file }: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Metadata
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Chi tiết file</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="ID" value={file.id} />
        <DetailItem label="Original file name" value={file.originalFileName} />
        <DetailItem label="Stored file name" value={file.fileName} />
        <DetailItem label="Stored path" value={file.storedPath} />
        <DetailItem label="Is encrypted" value={file.isEncrypted} />
        <DetailItem label="Created at" value={file.createdAt} />
        <DetailItem label="Updated at" value={file.updatedAt} />
        <DetailItem label="Deleted at" value={file.deletedAt} />
        <DetailItem label="Employee ID" value={file.employee?.id} />
        <DetailItem label="Employee code" value={file.employee?.code} />
        <DetailItem label="Employee name" value={file.employee?.name} />
      </div>
    </div>
  );
}