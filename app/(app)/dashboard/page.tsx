import { getApprovalPathSimulation, getKpis, getTrendData, getTodayAnomalies } from '@/lib/metrics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KpiTrendChart } from '@/components/charts/kpi-trend';
import { ApprovalPathChart } from '@/components/charts/approval-path';
import Link from 'next/link';

export default async function DashboardPage() {
  const kpis = getKpis();
  const approvalPath = getApprovalPathSimulation();
  const trend = getTrendData().slice(-14);
  const anomalies = getTodayAnomalies(6);

  const totals = approvalPath.reduce(
    (acc, item) => {
      acc.simulated += item.simulated;
      acc.baseline += item.baseline;
      return acc;
    },
    { simulated: 0, baseline: 0 }
  );
  const directShare = approvalPath.length
    ? Math.round((approvalPath[0].simulated / (totals.simulated || 1)) * 100)
    : 0;

  const kpiItems = [
    {
      label: 'Tempo médio de ciclo (h)',
      value: kpis.cycleTime,
      delta: '-18% vs. mês anterior'
    },
    {
      label: 'First Pass Approval %',
      value: `${kpis.firstPassRate}%`,
      delta: '+6 pts'
    },
    {
      label: 'Fila pendente',
      value: kpis.pending,
      delta: 'Simulação turno noturno'
    },
    {
      label: 'Reprovação por KO %',
      value: `${kpis.reprovalByKo}%`,
      delta: 'Meta: < 8%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Indicadores críticos hoje</h1>
          <p className="text-sm text-slate-600">
            Dados sintéticos atualizados com latência simulada. Use o modo Screenshot para exportar em alta definição.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/orders" className="inline-flex items-center rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand">
            Abrir fila
          </Link>
          <Link href="/print/dashboard" className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
            Imprimir dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiItems.map((item) => (
          <Card key={item.label} className="p-4">
            <CardHeader className="border-none p-0">
              <CardTitle>{item.label}</CardTitle>
              <CardDescription>{item.delta}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4 text-3xl font-semibold text-slate-900">{item.value}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tendência de aprovação x reprovação</CardTitle>
            <CardDescription>Últimos 14 dias de simulação determinística.</CardDescription>
          </CardHeader>
          <CardContent>
            <KpiTrendChart data={trend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de aprovação</CardTitle>
            <CardDescription>
              Projeção sintética: {directShare}% das ordens seguem para aprovação direta com o motor de IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApprovalPathChart data={approvalPath} />
            <p className="mt-4 text-sm text-slate-600">
              O cenário simulado considera expansão das regras explicáveis e treinamento contínuo: redução de{' '}
              {(totals.baseline - totals.simulated).toLocaleString('pt-BR')} análises humanas versus a base atual.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anomalias monitoradas hoje</CardTitle>
          <CardDescription>Ordens com risco &gt; 0,6 priorizadas para triagem.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="text-xs uppercase text-slate-400">
                  <th className="px-3 py-2">Ordem</th>
                  <th className="px-3 py-2">Planta</th>
                  <th className="px-3 py-2">Risco</th>
                  <th className="px-3 py-2">Variância</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {anomalies.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 font-medium text-slate-900">{item.id}</td>
                    <td className="px-3 py-2">{item.plantId}</td>
                    <td className="px-3 py-2">{item.riskScore.toFixed(2)}</td>
                    <td className="px-3 py-2">{item.variancePct.toFixed(2)}%</td>
                    <td className="px-3 py-2">{item.status}</td>
                    <td className="px-3 py-2 text-right">
                      <Link href={`/orders/${item.id}`} className="text-sm font-semibold text-brand">
                        Abrir ordem →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
