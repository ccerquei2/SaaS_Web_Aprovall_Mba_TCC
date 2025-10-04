'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScreenshotMode } from '@/hooks/useScreenshotMode';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { Search, Camera, LogOut, Menu } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Visão Geral' },
  { href: '/explainability', label: 'Explicabilidade IA' },
  { href: '/orders', label: 'Ordens de Serviço' },
  { href: '/audit', label: 'Auditoria' },
  { href: '/policies', label: 'Regras KO' },
  { href: '/experiments', label: 'Experimentos Controlados' },
  { href: '/settings', label: 'Configurações' },
  { href: '/help', label: 'Ajuda & Glossário' }
];

const screenshotScenes = [
  { href: '/dashboard?scene=kpis-hoje', label: 'Cena KPIs Hoje' },
  { href: '/orders?scene=fila-alta', label: 'Cena Fila Alta' },
  { href: '/orders?scene=risco-max', label: 'Cena Alto Risco' },
  { href: '/orders/C-NEB-PL1-WO-001?scene=historia', label: 'Cena História Ordem' },
  { href: '/audit?scene=trilha', label: 'Cena Trilha Auditoria' },
  { href: '/print/dashboard', label: 'Print Dashboard' },
  { href: '/print/order-story', label: 'Print Ordem' },
  { href: '/print/value-prop', label: 'Print Valor' }
];

const roles = [
  { id: 'USER', label: 'PCP / Fábrica' },
  { id: 'APPROVER', label: 'Aprovador' },
  { id: 'DECIDER', label: 'Decisor' },
  { id: 'GATEKEEPER', label: 'Gatekeeper' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { enabled, toggle } = useScreenshotMode();
  const [role, setRole] = useState<string>('USER');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeLabel = useMemo(() => navItems.find((item) => pathname?.startsWith(item.href))?.label, [
    pathname
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside
        className={clsx(
          'hide-in-screenshot hidden border-r border-slate-200 bg-white px-4 py-6 shadow-sm lg:block w-72',
          drawerOpen && 'block'
        )}
      >
        <div className="mb-6">
          <Link href="/" className="block text-xl font-semibold text-brand">
            Analisa IA
          </Link>
          <p className="text-sm text-slate-500">Work Order Auto-Approval</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-100',
                pathname?.startsWith(item.href)
                  ? 'bg-brand/10 text-brand'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Cenas para Capturas
          </h4>
          <div className="mt-3 space-y-2">
            {screenshotScenes.map((scene) => (
              <Link
                key={scene.href}
                href={scene.href}
                className="block rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-brand hover:text-brand"
              >
                {scene.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="hide-in-screenshot inline-flex items-center justify-center rounded-md border border-slate-200 p-2 lg:hidden"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label="Abrir navegação"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative w-64 max-w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Buscar ordens, plantas ou políticas"
                aria-label="Busca global"
              />
            </div>
            {activeLabel ? <span className="text-sm text-slate-500">{activeLabel}</span> : null}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium">Modo Screenshot</span>
              <button
                onClick={toggle}
                className={clsx(
                  'flex h-6 w-12 items-center rounded-full border border-transparent bg-slate-200 px-1 transition',
                  enabled && 'bg-brand text-white'
                )}
                aria-pressed={enabled}
              >
                <span
                  className={clsx(
                    'inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white text-slate-600 shadow transition',
                    enabled && 'translate-x-6'
                  )}
                >
                  <Camera className="h-3 w-3" />
                </span>
              </button>
            </label>
            <select
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              aria-label="Selecionar papel"
            >
              {roles.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="hide-in-screenshot inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </header>
        <main className="flex-1 bg-slate-50 p-6">
          <div className="screenshot-surface rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
