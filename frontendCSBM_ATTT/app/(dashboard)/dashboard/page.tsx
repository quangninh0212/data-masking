'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  Users,
  FileLock2,
  Settings,
  Shield,
  History,
  UserPlus,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';

import { getCurrentUser } from '@/lib/auth';
import { ROLES } from '@/lib/constants';

const shortcuts = [
  {
    title: 'Nhân viên',
    description: 'Xem danh sách và tìm kiếm hồ sơ nhân viên.',
    href: '/employees',
    adminOnly: false,
    icon: Users,
    tone: 'sky',
  },
  {
    title: 'Tạo hồ sơ',
    description: 'Tạo hồ sơ cá nhân cho user hiện tại.',
    href: '/employees/create',
    adminOnly: false,
    icon: UserPlus,
    tone: 'emerald',
  },
  {
    title: 'Tệp tin',
    description: 'Upload, decrypt, download và xóa file.',
    href: '/files',
    adminOnly: false,
    icon: FileLock2,
    tone: 'violet',
  },
  {
    title: 'Cài đặt',
    description: 'Cập nhật hồ sơ và đổi data password.',
    href: '/settings',
    adminOnly: false,
    icon: Settings,
    tone: 'amber',
  },
  {
    title: 'Admin Users',
    description: 'Tạo, sửa, reset password và xóa user.',
    href: '/admin/users',
    adminOnly: true,
    icon: Shield,
    tone: 'rose',
  },
  {
    title: 'Audit Logs',
    description: 'Xem lịch sử thao tác trong hệ thống.',
    href: '/admin/audit-logs',
    adminOnly: true,
    icon: History,
    tone: 'indigo',
  },
];

const toneClasses: Record<string, string> = {
  sky: 'from-sky-500/20 to-cyan-400/10 border-sky-400/20 text-sky-300',
  emerald:
    'from-emerald-500/20 to-lime-400/10 border-emerald-400/20 text-emerald-300',
  violet:
    'from-violet-500/20 to-fuchsia-400/10 border-violet-400/20 text-violet-300',
  amber:
    'from-amber-500/20 to-yellow-400/10 border-amber-400/20 text-amber-300',
  rose: 'from-rose-500/20 to-red-400/10 border-rose-400/20 text-rose-300',
  indigo:
    'from-indigo-500/20 to-blue-400/10 border-indigo-400/20 text-indigo-300',
};

export default function DashboardPage() {
  const user = getCurrentUser();
  const isAdmin = user?.role === ROLES.ADMIN;

  const visibleShortcuts = useMemo(() => {
    return shortcuts.filter((item) => !item.adminOnly || isAdmin);
  }, [isAdmin]);

  const primaryCards = visibleShortcuts.slice(0, 3);
  const secondaryCards = visibleShortcuts.slice(3);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.12),rgba(15,23,42,0.72)_40%,rgba(15,23,42,0.92))] p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              <LayoutDashboard size={14} />
              Dashboard Overview
            </div>

            <h1 className="mt-5 text-3xl font-bold text-white md:text-4xl">
              Xin chào, {user?.username || 'User'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Đây là trung tâm điều hướng để quản lý hồ sơ nhân viên, tệp tin mã hóa,
              thông tin tài khoản và các chức năng quản trị hệ thống.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Role
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {user?.role || 'UNKNOWN'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Access
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-300">
                Authorized
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 col-span-2 md:col-span-1">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Workspace
              </p>
              <p className="mt-2 text-sm font-semibold text-sky-300">
                Secure Console
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Primary modules
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Khu vực thao tác chính
          </h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {primaryCards.map((item) => {
            const Icon = item.icon;
            const tone = toneClasses[item.tone] || toneClasses.sky;

            return (
              <div
                key={item.href}
                className={`rounded-[28px] border bg-gradient-to-br p-6 ${tone}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {item.description}
                </p>

                <Link
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  Mở trang
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Quick access
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Truy cập nhanh
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {secondaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.href}
                className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-200">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={item.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition hover:text-sky-200"
                >
                  Truy cập
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}