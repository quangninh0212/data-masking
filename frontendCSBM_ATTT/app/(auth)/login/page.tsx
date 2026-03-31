'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, FileLock2, Users, Activity } from 'lucide-react';
import { authService } from '@/services/auth.service';
import {
  buildUserFromToken,
  getDefaultRouteByRole,
  getToken,
  isAuthenticated,
  setCurrentUser,
  setToken,
} from '@/lib/auth';
import { getErrorMessage } from '@/lib/utils';

function extractToken(data: any): string {
  return data?.token || data?.accessToken || data?.jwt || '';
}

const features = [
  {
    title: 'Access Control',
    description: 'Quản lý quyền truy cập theo vai trò người dùng.',
    icon: ShieldCheck,
  },
  {
    title: 'Secure File Flow',
    description: 'Upload, decrypt, download và theo dõi tệp tin an toàn.',
    icon: FileLock2,
  },
  {
    title: 'Employee Records',
    description: 'Theo dõi hồ sơ nhân viên và dữ liệu được bảo vệ.',
    icon: Users,
  },
  {
    title: 'Audit Monitoring',
    description: 'Kiểm soát lịch sử thao tác trong hệ thống.',
    icon: Activity,
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token && isAuthenticated()) {
      const user = buildUserFromToken(token);
      router.replace(getDefaultRouteByRole(user.role));
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await authService.login({
        username,
        password,
      });

      const token = extractToken(response.data);

      if (!token) {
        throw new Error('API login không trả token');
      }

      setToken(token);

      const tokenUser = buildUserFromToken(token);
      const mergedUser = {
        username: response.data?.username || tokenUser.username || username,
        role: response.data?.role || tokenUser.role || '',
      };

      setCurrentUser(mergedUser);

      router.replace(getDefaultRouteByRole(mergedUser.role));
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07101d] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_30%)]" />
      <div className="grid-pattern absolute inset-0 opacity-60" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 md:px-6">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/45 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
          <section className="hidden border-r border-white/10 p-8 lg:flex lg:flex-col lg:justify-between xl:p-12">
            <div>
              <div className="inline-flex rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                Secure Access Portal
              </div>

              <h1 className="title-glow mt-6 max-w-xl text-4xl font-bold leading-tight text-white xl:text-5xl">
                CSBM &amp; ATTT
                <span className="mt-2 block text-sky-300">
                  Security Management Console
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
                Hệ thống quản lý nhân viên, tệp tin mã hóa, quyền truy cập và audit
                logs trong một giao diện điều hành thống nhất.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="flex items-center justify-center p-6 md:p-8 xl:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                  Sign in
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  Đăng nhập hệ thống
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Sử dụng tài khoản đã được cấp để truy cập khu vực quản lý và
                  vận hành hệ thống.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              >
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Username
                    </label>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập username"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
                  >
                    {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
                </div>
              </form>

              <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                Secure authentication for employee records, encrypted file flow
                and audit monitoring.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}