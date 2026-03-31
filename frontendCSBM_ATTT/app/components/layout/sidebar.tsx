'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Shield,
  History,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, ROLES } from '@/lib/constants';
import { getCurrentUser } from '@/lib/auth';

const menu = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Nhân viên', href: ROUTES.EMPLOYEES, icon: Users },
  { label: 'Tạo hồ sơ', href: ROUTES.EMPLOYEE_CREATE, icon: UserPlus },
  { label: 'Tệp tin', href: ROUTES.FILES, icon: FileText },
  { label: 'Cài đặt', href: ROUTES.SETTINGS, icon: Settings },
];

const adminMenu = [
  { label: 'Admin Users', href: ROUTES.ADMIN_USERS, icon: Shield },
  { label: 'Audit Logs', href: ROUTES.AUDIT_LOGS, icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = getCurrentUser();
  const isAdmin = user?.role === ROLES.ADMIN;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="hidden min-h-screen w-80 border-r border-white/10 bg-[#08111f]/95 xl:block">
      <div className="flex min-h-screen flex-col px-5 py-6">
        <div className="panel-dark-strong rounded-3xl px-5 py-5">
          <div className="mb-4 inline-flex rounded-2xl border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Security Console
          </div>

          <h2 className="title-glow text-2xl font-bold text-white">
            CSBM & ATTT
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Employee, file, access control and audit monitoring dashboard.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Access
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                Protected
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Mode
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                Secure
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex-1">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Navigation
          </p>

          <nav className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-all duration-200',
                    active
                      ? 'border-sky-400/30 bg-sky-400/15 text-white shadow-[0_0_30px_rgba(56,189,248,0.12)]'
                      : 'border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition',
                      active
                        ? 'bg-sky-400/20 text-sky-300'
                        : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-200'
                    )}
                  >
                    <Icon size={18} />
                  </span>

                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p
                      className={cn(
                        'text-xs',
                        active ? 'text-sky-200/80' : 'text-slate-500'
                      )}
                    >
                      Truy cập nhanh
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {isAdmin ? (
            <div className="mt-7">
              <div className="mb-3 flex items-center gap-3 px-2">
                <div className="h-px flex-1 bg-white/10" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Admin
                </p>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <nav className="space-y-2">
                {adminMenu.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-all duration-200',
                        active
                          ? 'border-violet-400/30 bg-violet-400/15 text-white shadow-[0_0_30px_rgba(167,139,250,0.12)]'
                          : 'border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl transition',
                          active
                            ? 'bg-violet-400/20 text-violet-300'
                            : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-200'
                        )}
                      >
                        <Icon size={18} />
                      </span>

                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p
                          className={cn(
                            'text-xs',
                            active ? 'text-violet-200/80' : 'text-slate-500'
                          )}
                        >
                          Khu vực quản trị
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ) : null}
        </div>

        <div className="panel-dark mt-6 rounded-3xl px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Signed in
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-100">
            {user?.username || 'User'}
          </p>
          <p className="mt-1 text-xs text-slate-400">{user?.role || 'UNKNOWN'}</p>
        </div>
      </div>
    </aside>
  );
}