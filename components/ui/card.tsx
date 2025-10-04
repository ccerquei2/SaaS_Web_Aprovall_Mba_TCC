import { clsx } from 'clsx';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx('border-b border-slate-100 px-4 py-3', className)}>{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-slate-900">{children}</h3>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-500">{children}</p>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx('px-4 py-4', className)}>{children}</div>;
}
