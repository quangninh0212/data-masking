'use client';

import { useEffect, useState } from 'react';
import { KeyRound } from 'lucide-react';
import PageTitle from '../../components/common/page-title';
import Loading from '../../components/common/loading';
import EmployeeSearchForm from '../../components/employee/employee-search-form';
import EmployeeTable from '../../components/employee/employee-table';
import { employeeService } from '@/services/employee.service';
import type { Employee, EmployeeSearchRequest } from '@/types';
import { getErrorMessage } from '@/lib/utils';
import { getDataPassword, setDataPassword } from '@/lib/auth';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [dataPasswordInput, setDataPasswordInput] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await employeeService.getAll();
      setEmployees(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = getDataPassword();
    if (saved) {
      setDataPasswordInput(saved);
    }
    fetchEmployees();
  }, []);

  const handleSearch = async (values: EmployeeSearchRequest) => {
    setSearching(true);
    setError('');

    try {
      const response = await employeeService.search(values);
      setEmployees(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSearching(false);
    }
  };

  const handleReset = async () => {
    fetchEmployees();
  };

  const handleSaveDataPassword = async () => {
    setDataPassword(dataPasswordInput);
    await fetchEmployees();
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Danh sách nhân viên"
        subtitle="Quản lý truy cập dữ liệu hồ sơ, tìm kiếm nhân viên và mở trang chi tiết."
      />

      <div className="rounded-[28px] border border-sky-400/15 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(15,23,42,0.6)_45%,rgba(15,23,42,0.9))] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              <KeyRound size={14} />
              Data Access Control
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">
              Lưu data password để mở khóa dữ liệu hồ sơ
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Nếu key đúng, backend có thể trả về dữ liệu thật và trường
              <span className="mx-1 font-semibold text-sky-300">unlocked</span>
              sẽ là true.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Data password
                </label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
                  value={dataPasswordInput}
                  onChange={(e) => setDataPasswordInput(e.target.value)}
                  placeholder="Nhập để giải che dữ liệu"
                />
              </div>

              <button
                onClick={handleSaveDataPassword}
                className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Lưu data password
              </button>
            </div>
          </div>
        </div>
      </div>

      <EmployeeSearchForm
        loading={searching}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? <Loading /> : <EmployeeTable data={employees} />}
    </div>
  );
}