import { AuditTable } from '@/components/audit/audit-table';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Trilha de auditoria sintética</h1>
        <p className="text-sm text-slate-600">
          Cada decisão registrada gera um evento consultável. Use os filtros para montar narrativas de conformidade.
        </p>
      </div>
      <AuditTable />
    </div>
  );
}
