'use client';

import Link from 'next/link';
import type { Employee } from '@/types';
import { formatDate } from '@/lib/utils';
import EmptyState from '../common/empty-state';

type Props = {
  data: Employee[];
};

function Badge({
  label,
  tone = 'default',
}: {
  label: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  const styles = {
    default: 'border-white/10 bg-white/5 text-slate-200',
    success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    warning: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[tone]}`}>
      {label}
    </span>
  );
}

export default function EmployeeTable({ data }: Props) {
  if (!data.length) {
    return (
      <EmptyState
        title="Không có nhân viên"
        description="Danh sách hiện đang trống hoặc không có kết quả phù hợp."
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
              <th className="px-4 py-4">Mã NV</th>
              <th className="px-4 py-4">Tên</th>
              <th className="px-4 py-4">Giới tính</th>
              <th className="px-4 py-4">Số điện thoại</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Loại</th>
              <th className="px-4 py-4">Level</th>
              <th className="px-4 py-4">Ngày vào chính thức</th>
              <th className="px-4 py-4">Trạng thái</th>
              <th className="px-4 py-4">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {data.map((employee) => (
              <tr
                key={employee.id}
                className="border-t border-white/10 text-slate-300 transition hover:bg-white/[0.03]"
              >
                <td className="px-4 py-4">{employee.id}</td>
                <td className="px-4 py-4">{employee.code || '-'}</td>
                <td className="px-4 py-4 text-white">{employee.name || '-'}</td>
                <td className="px-4 py-4">{employee.gender || '-'}</td>
                <td className="px-4 py-4">{employee.phoneNumber || '-'}</td>
                <td className="px-4 py-4">{employee.email || '-'}</td>
                <td className="px-4 py-4">
                  {employee.type ? <Badge label={employee.type} /> : '-'}
                </td>
                <td className="px-4 py-4">
                  {employee.level ? <Badge label={employee.level} tone="warning" /> : '-'}
                </td>
                <td className="px-4 py-4">
                  {formatDate(employee.officialStartDate)}
                </td>
                <td className="px-4 py-4">
                  {employee.unlocked ? (
                    <Badge label="Đã mở khóa" tone="success" />
                  ) : (
                    <Badge label="Đang khóa" tone="default" />
                  )}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/employees/${employee.id}`}
                    className="inline-flex rounded-2xl border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-400/15"
                  >
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}