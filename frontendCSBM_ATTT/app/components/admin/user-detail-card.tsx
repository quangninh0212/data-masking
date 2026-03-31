import type { User } from '@/types';

type Props = {
  user: User;
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

export default function UserDetailCard({ user }: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          User Inspector
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Chi tiết user</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="ID" value={user.id} />
        <DetailItem label="Username" value={user.username} />
        <DetailItem label="Role" value={user.role} />
        <DetailItem label="Active" value={user.active} />
      </div>
    </div>
  );
}