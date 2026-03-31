import { ReactNode } from 'react';
import Sidebar from './sidebar';
import Header from './header';

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="app-shell-bg min-h-screen text-slate-100">
      <div className="grid-pattern min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-h-screen flex-1 flex-col">
            <Header />

            <main className="flex-1 px-4 py-5 md:px-6 md:py-6 xl:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="panel-dark rounded-[28px] p-4 md:p-6 xl:p-7">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}