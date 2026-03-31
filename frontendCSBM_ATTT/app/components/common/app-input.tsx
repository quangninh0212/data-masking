import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function AppInput({ label, className, ...props }: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        {...props}
        className={cn(
          'w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15',
          className
        )}
      />
    </div>
  );
}