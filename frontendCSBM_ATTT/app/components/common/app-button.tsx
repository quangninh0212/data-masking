import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-[0_8px_24px_rgba(14,165,233,0.22)]',
  secondary:
    'border border-white/10 text-slate-200 bg-white/5 hover:bg-white/10',
  danger:
    'border border-red-400/20 text-red-300 bg-red-400/10 hover:bg-red-400/15',
};

export default function AppButton({
  children,
  className,
  variant = 'primary',
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        'rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60',
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}