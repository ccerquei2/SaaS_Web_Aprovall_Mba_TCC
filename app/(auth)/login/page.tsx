'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const roles = [
  { id: 'USER', label: 'PCP / Fábrica' },
  { id: 'APPROVER', label: 'Aprovador (Controladoria)' },
  { id: 'DECIDER', label: 'Decisor (Diretoria)' },
  { id: 'GATEKEEPER', label: 'Gatekeeper (TI / Compras)' }
];

export default function LoginPage() {
  const [role, setRole] = useState('USER');
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-10 text-slate-100 shadow-2xl">
        <h1 className="text-2xl font-semibold">Entrar na experiência demo</h1>
        <p className="mt-2 text-sm text-slate-300">
          Escolha um papel para navegar. Não há autenticação real; a seleção apenas muda perspectivas e rótulos.
        </p>
        <div className="mt-6 space-y-3">
          {roles.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm transition ${
                role === option.id ? 'border-brand bg-brand/20 text-white' : 'hover:border-brand/50'
              }`}
            >
              <span>{option.label}</span>
              <input
                type="radio"
                className="h-4 w-4"
                checked={role === option.id}
                onChange={() => setRole(option.id)}
              />
            </label>
          ))}
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:shadow-brand/50"
        >
          Entrar no sandbox
        </button>
        <p className="mt-4 text-xs text-slate-400">
          Demonstração 100% sintética. Nenhum dado operacional real é carregado ou gravado.
        </p>
      </div>
    </main>
  );
}
