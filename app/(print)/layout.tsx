export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white px-12 py-10 text-slate-900">
      <header className="mb-6 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
        <span>Analisa IA – Suite para impressão</span>
        <span>{new Date().toLocaleString('pt-BR')}</span>
      </header>
      <main className="print-surface space-y-6">{children}</main>
    </div>
  );
}
