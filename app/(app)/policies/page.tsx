import { PoliciesManager } from '@/components/policies/policies-manager';

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Gestão de regras KO</h1>
        <p className="text-sm text-slate-600">
          Simule ativação e desativação de regras. Nenhuma alteração é persistida fora da sessão demo.
        </p>
      </div>
      <PoliciesManager />
    </div>
  );
}
