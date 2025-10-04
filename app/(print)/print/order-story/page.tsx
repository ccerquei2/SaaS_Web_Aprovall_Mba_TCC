import { getWorkOrderById } from '@/lib/store';

export default function PrintOrderStoryPage() {
  const order = getWorkOrderById('C-NEB-PL1-WO-001');
  if (!order) {
    return <p className="text-sm text-slate-500">Ordem de exemplo não encontrada no seed.</p>;
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-slate-900">História da ordem {order.id}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Planta {order.plantId} · Segmento {order.segment}. Variância {order.variancePct.toFixed(2)}% · Risco {order.riskScore.toFixed(2)}.
        </p>
      </section>
      <section className="rounded-xl border border-slate-200 p-4 text-sm">
        <h2 className="text-lg font-semibold text-slate-900">Checagens KO</h2>
        <ul className="mt-3 space-y-2">
          {order.koChecks.map((check) => (
            <li key={check.key} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div>
                <p className="font-medium text-slate-900">{check.label}</p>
                <p className="text-xs text-slate-500">{check.detail}</p>
              </div>
              <span className={check.passed ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                {check.passed ? 'OK' : 'KO'}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-slate-200 p-4 text-sm">
        <h2 className="text-lg font-semibold text-slate-900">Justificativas recebidas</h2>
        {order.justifications.length === 0 ? (
          <p className="text-xs text-slate-500">Sem justificativas nesta ordem.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {order.justifications.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-900">{item.authorRole}</p>
                <p>{item.text}</p>
                <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString('pt-BR')}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="rounded-xl border border-slate-200 p-4 text-sm">
        <h2 className="text-lg font-semibold text-slate-900">Linha do tempo</h2>
        <ol className="mt-3 space-y-2">
          {order.timeline.map((event) => (
            <li key={event.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">{event.label}</span>
                <span className="text-xs text-slate-400">{new Date(event.createdAt).toLocaleString('pt-BR')}</span>
              </div>
              <p className="text-xs text-slate-500">{event.description}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="rounded-xl border border-slate-200 p-4 text-sm">
        <h2 className="text-lg font-semibold text-slate-900">Racional final</h2>
        <p>
          Status final: {order.status}. Decisões registradas: {order.decisions
            .map((decision) => `${decision.actorRole} → ${decision.action}`)
            .join(', ')}.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Resumo pronto para slides do TCC: evidência de KO, justificativa e decisão alinhadas com governança.
        </p>
      </section>
    </div>
  );
}
