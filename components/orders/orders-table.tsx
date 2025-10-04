'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WorkOrderRow {
  id: string;
  plantId: string;
  segment: string;
  variancePct: number;
  riskScore: number;
  status: string;
  koChecks: Array<{ key: string; passed: boolean }>;
}

interface FilterState {
  status: string;
  segment: string;
  risk: string;
}

export function OrdersTable({ initialStatus }: { initialStatus?: string }) {
  const [data, setData] = useState<WorkOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ status: initialStatus ?? '', segment: '', risk: '' });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.segment) params.append('segment', filters.segment);
        if (filters.risk) params.append('risk', filters.risk);
        const response = await fetch(`/api/orders?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar ordens. Tente novamente.');
        }
        const payload = await response.json();
        setData(payload.data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters.status, filters.segment, filters.risk]);

  const columns = useMemo<ColumnDef<WorkOrderRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Ordem',
        cell: ({ row }) => (
          <Link href={`/orders/${row.original.id}`} className="font-semibold text-brand">
            {row.original.id}
          </Link>
        )
      },
      {
        accessorKey: 'plantId',
        header: 'Planta'
      },
      {
        accessorKey: 'segment',
        header: 'Segmento'
      },
      {
        accessorKey: 'variancePct',
        header: 'Variância %',
        cell: ({ row }) => (
          <span className={Math.abs(row.original.variancePct) > 15 ? 'text-danger font-semibold' : ''}>
            {row.original.variancePct.toFixed(2)}%
          </span>
        )
      },
      {
        accessorKey: 'riskScore',
        header: 'Risco',
        cell: ({ row }) => (
          <span className={row.original.riskScore > 0.6 ? 'text-warning font-semibold' : ''}>
            {row.original.riskScore.toFixed(2)}
          </span>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status'
      },
      {
        accessorKey: 'koChecks',
        header: 'Regras KO',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original.koChecks.map((check) => (
              <Badge key={check.key} tone={check.passed ? 'success' : 'danger'}>
                {check.passed ? 'OK' : 'KO'} {check.key}
              </Badge>
            ))}
          </div>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  function handleExport() {
    const header = ['id', 'plantId', 'segment', 'variancePct', 'riskScore', 'status'];
    const rows = data.map((row) => {
      const generic = row as unknown as Record<string, unknown>;
      return header.map((key) => String(generic[key] ?? '')).join(',');
    });
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ordens-analisa-ia.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="">Todos os status</option>
            <option value="PENDING">Pendentes</option>
            <option value="NEEDS_JUSTIFICATION">Aguardando justificativa</option>
            <option value="APPROVED">Aprovados</option>
            <option value="REPROVED">Reprovados</option>
          </select>
          <select
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={filters.segment}
            onChange={(event) => setFilters((prev) => ({ ...prev, segment: event.target.value }))}
          >
            <option value="">Todos os segmentos</option>
            <option value="S1">S1 – Regulatórios</option>
            <option value="S2">S2 – Alto volume</option>
            <option value="S3">S3 – 24/7</option>
            <option value="S4">S4 – Multi-plantas</option>
          </select>
          <select
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={filters.risk}
            onChange={(event) => setFilters((prev) => ({ ...prev, risk: event.target.value }))}
          >
            <option value="">Todos os riscos</option>
            <option value="0.6">Risco ≥ 0,60</option>
            <option value="0.75">Risco ≥ 0,75</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" onClick={handleExport} className="bg-slate-900 hover:bg-slate-800">
            Exportar CSV
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger/40 bg-danger/5 p-4 text-sm text-danger">{error}</div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-600">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-100 text-xs uppercase text-slate-400">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-slate-400">
                  Carregando ordens com latência simulada...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-slate-400">
                  Nenhum resultado com os filtros atuais.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 text-sm text-slate-600">
        <span>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <Button type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="bg-slate-200 text-slate-700 hover:bg-slate-300">
          Anterior
        </Button>
        <Button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="bg-slate-200 text-slate-700 hover:bg-slate-300">
          Próxima
        </Button>
      </div>
    </div>
  );
}
