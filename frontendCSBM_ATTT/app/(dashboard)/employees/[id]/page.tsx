'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { employeeService } from '@/services/employee.service';

import EmployeeDetailCard from '../../../components/employee/employee-detail-card';
import type { Employee } from '@/types';
import { getErrorMessage } from '@/lib/utils';
import PageTitle from '@/app/components/common/page-title';
import Loading from '@/app/components/common/loading';

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await employeeService.getById(params.id);
        setEmployee(response.data);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchDetail();
    }
  }, [params?.id]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/employees"
          className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          ← Quay lại danh sách
        </Link>
      </div>

      <PageTitle
        title="Chi tiết nhân viên"
        subtitle={`Thông tin hồ sơ nhân viên #${params.id}`}
      />

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loading />
      ) : employee ? (
        <EmployeeDetailCard employee={employee} />
      ) : null}
    </div>
  );
}