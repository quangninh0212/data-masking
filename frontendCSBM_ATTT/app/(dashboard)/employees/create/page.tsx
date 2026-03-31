'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '../../../components/common/page-title';
import EmployeeProfileForm from '../../../components/employee/employee-profile-form';
import { employeeService } from '@/services/employee.service';
import { getErrorMessage } from '@/lib/utils';
import { setDataPassword } from '@/lib/auth';
import type { EmployeeCreateRequest, EmployeeUpdateRequest } from '@/types';

export default function CreateEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (payload: EmployeeCreateRequest | EmployeeUpdateRequest) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const createPayload = payload as EmployeeCreateRequest;
      await employeeService.createMyProfile(createPayload);

      if (createPayload.dataPassword) {
        setDataPassword(createPayload.dataPassword);
      }

      setSuccess('Tạo hồ sơ thành công.');
      router.push('/settings');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Tạo hồ sơ nhân viên"
        subtitle="Thiết lập hồ sơ cá nhân cho tài khoản đang đăng nhập và cấu hình data password ban đầu."
      />

      <div className="rounded-[28px] border border-emerald-400/15 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(15,23,42,0.62)_45%,rgba(15,23,42,0.94))] p-5">
        <h2 className="text-xl font-semibold text-white">Khởi tạo hồ sơ cá nhân</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
          Sau khi tạo hồ sơ thành công, data password sẽ được lưu lại trên trình duyệt
          để sử dụng cho các bước giải mã và cập nhật về sau.
        </p>
      </div>

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

      <EmployeeProfileForm mode="create" loading={loading} onSubmit={handleSubmit} />
    </div>
  );
}