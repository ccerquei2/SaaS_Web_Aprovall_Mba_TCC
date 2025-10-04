import { clsx } from 'clsx';

export function Badge({ className, children, tone = 'default' }: { className?: string; children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const tones: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-brand/10 text-brand'
  };
  return (
    <span
      className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide', tones[tone], className)}
    >
      {children}
    </span>
  );
}
