'use client';

import type { Employee } from '@/types';
import { formatDate } from '@/lib/utils';

type Props = {
  employee: Employee;
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
      <p className="mt-2 text-sm leading-6 text-slate-200">
        {value !== undefined && value !== null && value !== ''
          ? String(value)
          : '-'}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  );
}

export default function EmployeeDetailCard({ employee }: Props) {
  return (
    <div className="space-y-5">
      <Section title="Thông tin cơ bản">
        <DetailItem label="ID" value={employee.id} />
        <DetailItem label="Mã nhân viên" value={employee.code} />
        <DetailItem label="Họ tên" value={employee.name} />
        <DetailItem label="Giới tính" value={employee.gender} />
        <DetailItem label="Ngày sinh" value={formatDate(employee.dateOfBirth)} />
        <DetailItem label="Loại nhân viên" value={employee.type} />
        <DetailItem label="Level" value={employee.level} />
        <DetailItem label="Năm tốt nghiệp" value={employee.graduationYear} />
        <DetailItem label="Học vấn" value={employee.education} />
      </Section>

      <Section title="Mốc thời gian công việc">
        <DetailItem
          label="Ngày bắt đầu thử việc"
          value={formatDate(employee.probationaryStartDate)}
        />
        <DetailItem
          label="Ngày kết thúc thử việc"
          value={formatDate(employee.probationaryEndDate)}
        />
        <DetailItem
          label="Ngày vào chính thức"
          value={formatDate(employee.officialStartDate)}
        />
      </Section>

      <Section title="Liên hệ và giấy tờ">
        <DetailItem label="Email công ty" value={employee.email} />
        <DetailItem label="Email cá nhân" value={employee.personalEmail} />
        <DetailItem label="Số điện thoại" value={employee.phoneNumber} />
        <DetailItem label="Mã số thuế" value={employee.taxCode} />
        <DetailItem label="Mã BHXH" value={employee.socialInsuranceCode} />
        <DetailItem label="CCCD" value={employee.citizenIdentificationCode} />
        <DetailItem label="Nơi sinh" value={employee.birthplace} />
        <DetailItem label="Địa chỉ hiện tại" value={employee.currentAddress} />
        <DetailItem label="Địa chỉ thường trú" value={employee.permanentAddress} />
      </Section>

      <Section title="Ngân hàng và bảo mật">
        <DetailItem label="Ngân hàng" value={employee.bankName} />
        <DetailItem label="Số tài khoản" value={employee.bankAccountNumber} />
        <DetailItem
          label="Trạng thái mở khóa"
          value={employee.unlocked ? 'Đã mở' : 'Đang khóa'}
        />
      </Section>
    </div>
  );
}