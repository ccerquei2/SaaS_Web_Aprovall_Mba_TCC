import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ApprovalPathChart } from '@/components/charts/approval-path';
import { Badge } from '@/components/ui/badge';
import { getApprovalPathSimulation, getExplainabilityCases } from '@/lib/metrics';
import Link from 'next/link';

export default async function ExplainabilityPage() {
  const approvalPath = getApprovalPathSimulation();
  const explainabilityCases = getExplainabilityCases(6);

  const baselineTotal = approvalPath.reduce((acc, item) => acc + item.baseline, 0);
  const simulatedTotal = approvalPath.reduce((acc, item) => acc + item.simulated, 0);
  const autoBaselineShare = approvalPath.length
    ? Math.round((approvalPath[0].baseline / (baselineTotal || 1)) * 100)
    : 0;
  const autoSimulatedShare = approvalPath.length
    ? Math.round((approvalPath[0].simulated / (simulatedTotal || 1)) * 100)
    : 0;

  const avgConfidence = explainabilityCases.length
    ? Math.round(
        explainabilityCases.reduce((acc, item) => acc + item.confidence, 0) /
          explainabilityCases.length
      )
    : 0;

  const uniqueRules = new Set<string>();
  explainabilityCases.forEach((item) => {
    item.rules.forEach((rule) => uniqueRules.add(rule.label));
  });

  const formatter = new Intl.NumberFormat('pt-BR');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Explicabilidade das decisões de IA</h1>
        <p className="text-sm text-slate-600">
          Transparência e confiança na jornada de aprovação automática: cada decisão traz regras acionadas, evidências
          e versão do modelo para reconstruir o fluxo segundo NIST (2023).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="border-none pb-2">
            <CardTitle>Versão do modelo</CardTitle>
            <CardDescription>Motor analítico em produção</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-900">v2.4.1-sim</CardContent>
        </Card>
        <Card>
          <CardHeader className="border-none pb-2">
            <CardTitle>Cobertura explicável</CardTitle>
            <CardDescription>Casos com trilha completa</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-900">
            {avgConfidence}%<span className="ml-2 text-base font-normal text-slate-500">confiança média</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-none pb-2">
            <CardTitle>Regras ativas</CardTitle>
            <CardDescription>Impacto direto na aprovação</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-900">{uniqueRules.size}</CardContent>
        </Card>
        <Card>
          <CardHeader className="border-none pb-2">
            <CardTitle>Reconstrução de fluxo</CardTitle>
            <CardDescription>Tempo médio sintético</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-900">12s</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Simulação do motor de aprovação</CardTitle>
          <CardDescription>
            Hoje, {autoBaselineShare}% das ordens são aprovadas automaticamente; com o modelo v2.4.1-sim, o percentual
            sobe para {autoSimulatedShare}% em dados sintéticos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApprovalPathChart data={approvalPath} />
          <p className="mt-4 text-sm text-slate-600">
            A projeção considera ajuste de thresholds, versionamento das regras KO e feedback supervisionado de
            controladoria. O ganho esperado elimina {formatter.format(baselineTotal - simulatedTotal)} análises humanas
            em um horizonte mensal simulado.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ordens monitoradas com explicação completa</CardTitle>
          <CardDescription>Casos de maior risco selecionados automaticamente para auditoria contínua.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="text-xs uppercase text-slate-400">
                  <th className="px-3 py-2">Ordem</th>
                  <th className="px-3 py-2">Planta</th>
                  <th className="px-3 py-2">Risco</th>
                  <th className="px-3 py-2">Regras acionadas</th>
                  <th className="px-3 py-2">Evidências</th>
                  <th className="px-3 py-2">Decisão</th>
                  <th className="px-3 py-2">Modelo</th>
                  <th className="px-3 py-2 text-right">Reconstrução</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {explainabilityCases.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 font-medium text-slate-900">{item.id}</td>
                    <td className="px-3 py-2">{item.plantId}</td>
                    <td className="px-3 py-2">{item.riskScore.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        {item.rules.length ? (
                          item.rules.map((rule) => (
                            <Badge key={rule.key} variant="outline">
                              {rule.label}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Nenhuma regra acionada</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <ul className="list-disc space-y-1 pl-4">
                        {item.evidence.map((entry, index) => (
                          <li key={`${item.id}-ev-${index}`}>{entry}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-3 py-2">
                      {item.decision ? (
                        <div className="space-y-1">
                          <span className="block font-medium text-slate-900">{item.decision.action}</span>
                          <span className="block text-xs text-slate-400">{item.decision.reason}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Decisão pendente</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-slate-900">{item.modelVersion}</span>
                        <span className="block text-xs text-slate-400">Confiança {item.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Link href={`/orders/${item.id}`} className="text-sm font-semibold text-brand">
                        Reproduzir fluxo →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como cada explicação é construída</CardTitle>
          <CardDescription>Pipeline governado para garantir trilhas auditáveis.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-slate-600">
            <li>
              <span className="font-semibold text-slate-900">1. Avaliação KO em tempo real.</span> Motor verifica regras
              críticas, registra thresholds e captura evidências de sensores, ERP e anexos.
            </li>
            <li>
              <span className="font-semibold text-slate-900">2. Classificador gerencia exceções.</span> Score de risco e
              variância definem se a ordem segue para justificativa obrigatória da fábrica ou exceção humana.
            </li>
            <li>
              <span className="font-semibold text-slate-900">3. Explicação disponibilizada.</span> Para cada decisão,
              armazenamos versão do modelo, features dominantes e links para reconstruir o fluxo com um clique.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
