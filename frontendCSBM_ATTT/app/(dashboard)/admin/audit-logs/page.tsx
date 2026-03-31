'use client';

import { useEffect, useState } from 'react';

import { ROLES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/utils';
import { auditLogService } from '@/services/audit-log.service';
import type { AuditLog } from '@/types';
import ProtectedRoute from '@/app/components/auth/protected-route';
import PageTitle from '@/app/components/common/page-title';
import Loading from '@/app/components/common/loading';
import AuditLogTable from '@/app/components/admin/audit-log-table';
import AuditLogDetailCard from '@/app/components/admin/audit-log-detail-card';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingSelected, setLoadingSelected] = useState(false);

  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoadingList(true);
    setError('');

    try {
      const response = await auditLogService.getAll();
      setLogs(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSelectLog = async (logId: number) => {
    setLoadingSelected(true);
    setError('');

    try {
      const response = await auditLogService.getById(logId);
      setSelectedLog(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingSelected(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="space-y-6">
        <PageTitle
          title="Audit Logs"
          subtitle="Theo dõi lịch sử thao tác, kiểm tra chi tiết sự kiện và kiểm soát hoạt động trong hệ thống."
        />

        <div className="rounded-[28px] border border-indigo-400/15 bg-[linear-gradient(135deg,rgba(99,102,241,0.14),rgba(15,23,42,0.62)_45%,rgba(15,23,42,0.94))] p-5">
          <h2 className="text-xl font-semibold text-white">System activity monitor</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
            Xem toàn bộ audit log, đọc hành động đã xảy ra và kiểm tra chi tiết từng
            bản ghi phục vụ giám sát hệ thống.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {loadingList ? (
          <Loading />
        ) : (
          <AuditLogTable
            logs={logs}
            selectedLogId={selectedLog?.id}
            onSelect={handleSelectLog}
          />
        )}

        {loadingSelected ? <Loading /> : null}

        {selectedLog ? <AuditLogDetailCard log={selectedLog} /> : null}
      </div>
    </ProtectedRoute>
  );
}