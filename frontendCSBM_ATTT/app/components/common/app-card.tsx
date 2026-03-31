import { ReactNode } from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
};

export default function AppCard({
  title,
  subtitle,
  children,
  rightSlot,
}: Props) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:bg-white/[0.06]">
      {(title || subtitle || rightSlot) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>
            ) : null}
          </div>

          {rightSlot ? <div>{rightSlot}</div> : null}
        </div>
      )}

      {children}
    </div>
  );
}