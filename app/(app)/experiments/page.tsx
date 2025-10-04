const experiments = [
  {
    id: 'EXP-001',
    name: 'UI focada em risco elevado',
    guardrail: 'Não aumentar reprovação injustificada',
    uplift: '+4,3% na aprovação automática',
    description: 'Destaca cards de risco > 0,7 na fila para PCP e Aprovadores.'
  },
  {
    id: 'EXP-002',
    name: 'Política KO flexível no segmento S2',
    guardrail: 'Variância < 12% sem justificativa adicional',
    uplift: '+2,1% na velocidade de decisão',
    description: 'Permite tolerância maior para lotes promo em Boreal Alimentos e Prisma Bebidas.'
  },
  {
    id: 'EXP-003',
    name: 'Fluxo overnight 24/7',
    guardrail: 'Tempo de ciclo < 6h noturno',
    uplift: '+1,8% na disponibilidade de recursos',
    description: 'Escala aprovadores para turnos 02:00 – 06:00 com alertas push simulados.'
  }
];

export default function ExperimentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Experimentos controlados</h1>
        <p className="text-sm text-slate-600">
          Testes sintéticos que demonstram como aplicamos metodologia controlada antes do rollout para plantas reais.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {experiments.map((experiment) => (
          <div key={experiment.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-slate-400">{experiment.id}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">{experiment.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{experiment.description}</p>
            <div className="mt-4 rounded-xl border border-brand/30 bg-brand/5 p-3 text-xs text-brand">
              Guardrail: {experiment.guardrail}
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">Resultado simulado: {experiment.uplift}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
