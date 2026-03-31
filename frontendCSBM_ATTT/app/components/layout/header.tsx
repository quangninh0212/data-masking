'use client';

import { useRouter } from 'next/navigation';
import { clearAuth, getCurrentUser } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#08111f]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
            Security Control Center
          </p>
          <h1 className="mt-2 text-lg font-semibold text-white md:text-xl">
            Monitoring & Access Overview
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Theo dõi tài khoản, hồ sơ nhân viên, tệp tin và thao tác hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:block">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Current user
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-100">
                {user?.username || 'User'}
              </span>
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-300">
                {user?.role || 'UNKNOWN'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/15"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}