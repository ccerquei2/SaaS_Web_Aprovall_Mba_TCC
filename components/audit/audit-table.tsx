'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface AuditRow {
  id: string;
  actor: string;
  role: string;
  action: string;
  detail: string;
  createdAt: string;
  plantId: string;
  workOrderId?: string;
}

export function AuditTable() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        const response = await fetch(`/api/audit?${params.toString()}`);
        if (!response.ok) throw new Error('Falha ao carregar auditoria.');
        const payload = await response.json();
        setRows(payload.data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role]);

  function handleExport() {
    const csv = rows
      .map((row) => `${row.id},${row.role},${row.action},${row.plantId},${row.workOrderId ?? ''},${row.createdAt}`)
      .join('\n');
    const blob = new Blob(['id,role,action,plant,workOrder,createdAt\n' + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'auditoria-analisa-ia.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm" value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="">Todos os papéis</option>
          <option value="USER">PCP / Fábrica</option>
          <option value="APPROVER">Aprovador</option>
          <option value="DECIDER">Decisor</option>
        </select>
        <div className="flex items-center gap-3">
          <Button type="button" onClick={handleExport} className="bg-slate-900 hover:bg-slate-800">
            Exportar CSV
          </Button>
          <Button type="button" onClick={() => window.print()} className="bg-brand hover:bg-brand/90">
            Imprimir trilha
          </Button>
        </div>
      </div>
      {error ? <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm text-danger">{error}</div> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-600">
          <thead>
            <tr className="text-xs uppercase text-slate-400">
              <th className="px-3 py-2">Momento</th>
              <th className="px-3 py-2">Ação</th>
              <th className="px-3 py-2">Papel</th>
              <th className="px-3 py-2">Detalhe</th>
              <th className="px-3 py-2">Ordem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-xs text-slate-400">
                  Carregando registros...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-xs text-slate-400">
                  Nenhum evento encontrado.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-2">{new Date(row.createdAt).toLocaleString('pt-BR')}</td>
                  <td className="px-3 py-2 font-medium text-slate-900">{row.action}</td>
                  <td className="px-3 py-2">{row.role}</td>
                  <td className="px-3 py-2 text-slate-500">{row.detail}</td>
                  <td className="px-3 py-2">{row.workOrderId ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
