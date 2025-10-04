import { getKpis, getSegmentMix, getTrendData } from '@/lib/metrics';

export default function PrintDashboardPage() {
  const kpis = getKpis();
  const segmentMix = getSegmentMix();
  const trend = getTrendData().slice(-7);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard operacional – visão para impressão</h1>
        <p className="mt-2 text-sm text-slate-500">
          KPI determinísticos para screenshots: ciclo {kpis.cycleTime}h, FPA {kpis.firstPassRate}%, fila {kpis.pending} ordens.
        </p>
      </section>
      <section className="grid grid-cols-4 gap-4 text-sm">
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="text-xs uppercase text-slate-500">Tempo de ciclo</h2>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{kpis.cycleTime} h</p>
          <p className="text-xs text-slate-400">Meta: 6h</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="text-xs uppercase text-slate-500">First pass approval</h2>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{kpis.firstPassRate}%</p>
          <p className="text-xs text-slate-400">+6 pts vs último mês</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="text-xs uppercase text-slate-500">Fila pendente</h2>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{kpis.pending}</p>
          <p className="text-xs text-slate-400">Modo sazonal ativado</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="text-xs uppercase text-slate-500">Reprovação KO</h2>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{kpis.reprovalByKo}%</p>
          <p className="text-xs text-slate-400">Limite &lt; 8%</p>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Tendência semanal</h2>
        <table className="mt-3 w-full text-left text-xs text-slate-600">
          <thead>
            <tr className="text-slate-400">
              <th className="py-2">Dia</th>
              <th>Aprovações</th>
              <th>Reprovações</th>
              <th>Pendentes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trend.map((point) => (
              <tr key={point.date}>
                <td className="py-2">{point.date}</td>
                <td>{point.approvals}</td>
                <td>{point.reprovals}</td>
                <td>{point.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Mix de segmentos</h2>
        <ul className="mt-2 grid grid-cols-2 gap-3 text-xs text-slate-600">
          {segmentMix.map((item) => (
            <li key={item.segment} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="font-semibold text-slate-900">Segmento {item.segment}</p>
              <p>{item.value} ordens em fila</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
