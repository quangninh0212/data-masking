'use client';

import { useEffect, useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { employeeService } from '@/services/employee.service';
import { getErrorMessage } from '@/lib/utils';
import { getDataPassword, setDataPassword } from '@/lib/auth';
import type {
  ChangeDataPasswordRequest,
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
} from '@/types';
import PageTitle from '@/app/components/common/page-title';
import ChangeDataPasswordForm from '@/app/components/employee/change-data-password-form';
import EmployeeProfileForm from '@/app/components/employee/employee-profile-form';
import Loading from '@/app/components/common/loading';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [unlockingProfile, setUnlockingProfile] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [dataPasswordInput, setDataPasswordInput] = useState('');
  const [currentDataPassword, setCurrentDataPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    setLoadingProfile(true);
    setError('');

    try {
      const response = await employeeService.getMyProfile();
      setProfile(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    const saved = getDataPassword() || '';
    setDataPasswordInput(saved);
    setCurrentDataPassword(saved);
    fetchProfile();
  }, []);

  const handleUnlockProfile = async () => {
    setUnlockingProfile(true);
    setError('');
    setSuccess('');

    try {
      if (!dataPasswordInput) {
        throw new Error('Vui lòng nhập data password.');
      }

      setDataPassword(dataPasswordInput);
      setCurrentDataPassword(dataPasswordInput);

      const response = await employeeService.getMyProfile();
      setProfile(response.data);
      setSuccess('Giải mã dữ liệu hồ sơ thành công.');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUnlockingProfile(false);
    }
  };

  const handleUpdateProfile = async (
    payload: EmployeeCreateRequest | EmployeeUpdateRequest
  ) => {
    setUpdatingProfile(true);
    setError('');
    setSuccess('');

    try {
      if (!currentDataPassword) {
        throw new Error('Vui lòng nhập key và bấm "Giải mã dữ liệu" trước khi cập nhật.');
      }

      const updatePayload = {
        ...(payload as EmployeeUpdateRequest),
        dataPassword: currentDataPassword,
      };

      await employeeService.updateMyProfile(updatePayload);

      setSuccess('Cập nhật hồ sơ thành công.');
      await fetchProfile();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangeDataPassword = async (payload: ChangeDataPasswordRequest) => {
    setChangingPassword(true);
    setError('');
    setSuccess('');

    try {
      await employeeService.changeDataPassword(payload);

      setDataPassword(payload.newDataPassword);
      setCurrentDataPassword(payload.newDataPassword);
      setDataPasswordInput(payload.newDataPassword);

      setSuccess('Đổi data password thành công.');
      await fetchProfile();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Cài đặt"
        subtitle="Quản lý key giải mã, cập nhật hồ sơ cá nhân và thay đổi data password."
      />

      <div className="rounded-[28px] border border-sky-400/15 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(15,23,42,0.6)_45%,rgba(15,23,42,0.94))] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              <ShieldCheck size={14} />
              Profile Security
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">
              Khu vực cấu hình bảo mật hồ sơ
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Nhập đúng key để tải dữ liệu thật, sau đó mới chỉnh sửa thông tin cá nhân
              hoặc xoay vòng data password.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Key status
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {currentDataPassword ? 'Ready for use' : 'Missing'}
            </p>
          </div>
        </div>
      </div>

      {!currentDataPassword ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
          Chưa có key giải mã đang dùng. Hồ sơ có thể đang hiển thị dạng ****.
        </div>
      ) : (
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-300">
          Đã có key giải mã trên trình duyệt. Bạn có thể bấm giải mã lại hồ sơ bất cứ lúc nào.
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

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            <KeyRound size={14} />
            Unlock Profile Data
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">
            Giải mã dữ liệu hồ sơ
          </h2>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="w-full max-w-md">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Data password
            </label>
            <input
              type="password"
              value={dataPasswordInput}
              onChange={(e) => setDataPasswordInput(e.target.value)}
              placeholder="Nhập key để hiển thị dữ liệu thật"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            />
          </div>

          <button
            onClick={handleUnlockProfile}
            disabled={unlockingProfile}
            className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
          >
            {unlockingProfile ? 'Đang giải mã...' : 'Giải mã dữ liệu'}
          </button>
        </div>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          Nhập đúng key rồi bấm nút này để tải lại hồ sơ đã giải mã. Sau đó mới chỉnh sửa
          và cập nhật.
        </p>
      </div>

      {loadingProfile ? (
        <Loading />
      ) : profile ? (
        <div className="space-y-6">
          <EmployeeProfileForm
            mode="update"
            initialData={profile}
            loading={updatingProfile}
            currentDataPassword={currentDataPassword}
            onSubmit={handleUpdateProfile}
          />

          <ChangeDataPasswordForm
            loading={changingPassword}
            onSubmit={handleChangeDataPassword}
          />
        </div>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <p className="text-sm leading-7 text-slate-300">
            Tài khoản này chưa có hồ sơ cá nhân. Hãy vào trang tạo hồ sơ trước.
          </p>
          <a
            href="/employees/create"
            className="mt-4 inline-flex rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Tạo hồ sơ ngay
          </a>
        </div>
      )}
    </div>
  );
}