import type { AuditLog } from '@/types';

type Props = {
  log: AuditLog;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm text-slate-200">{value || '-'}</p>
    </div>
  );
}

export default function AuditLogDetailCard({ log }: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Log Inspector
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Chi tiết audit log
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="ID" value={log.id} />
        <DetailItem label="Username" value={log.username} />
        <DetailItem label="Action" value={log.action} />
        <DetailItem label="Entity name" value={log.entityName} />
        <DetailItem label="Entity ID" value={log.entityId} />
        <DetailItem label="Created at" value={log.createdAt} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Description
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-200">
          {log.description || '-'}
        </p>
      </div>
    </div>
  );
}