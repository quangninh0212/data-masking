type Props = {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
};

const styles = {
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  error: 'border-red-400/20 bg-red-400/10 text-red-300',
  warning: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  info: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
};

export default function StatusAlert({
  type = 'info',
  message,
}: Props) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}