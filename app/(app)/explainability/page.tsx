import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApprovalMixChart } from '@/components/charts/approval-mix';
import { getApprovalFlowBreakdown, getExplainabilityCases } from '@/lib/metrics';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
}

export default function ExplainabilityPage() {
  const approvalBreakdown = getApprovalFlowBreakdown();
  const cases = getExplainabilityCases();

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Explicabilidade das decisões dos agentes IA</h1>
          <p className="text-sm text-slate-600">
            Cada decisão automatizada traz evidências, trilha de auditoria e links para reconstrução completa do fluxo, em linha
            com os princípios de transparência e gestão de risco (NIST, 2023).
          </p>
        </div>
        <blockquote className="rounded-xl border-l-4 border-brand bg-slate-50 px-4 py-3 text-sm text-slate-700">
          “Transparência e confiança - Cada decisão automatizada traz os “porquês” como, regras acionadas, evidências, versão do
          modelo e links para reconstrução do fluxo alinhado aos princípios de gestão de risco e explicabilidade em IA (NIST,
          2023). Para o cliente, isso vira relacionamento: menos surpresa, mais previsibilidade.”
        </blockquote>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {approvalBreakdown.items.map((item) => (
          <Card key={item.key} className="border-brand/20 bg-gradient-to-br from-white via-white to-slate-50">
            <CardHeader className="pb-2">
              <CardTitle>{item.label}</CardTitle>
              <CardDescription>Volume sintético calibrado para este cenário.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-semibold text-slate-900">{item.value} ordens</p>
              <p className="text-sm text-slate-600">{item.percentage}% do total processado</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Como o fluxo de aprovação se reparte</CardTitle>
          <CardDescription>Dados simulados alimentam o motor Aurora-v1.3-sim para orientar decisões em tempo real.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ApprovalMixChart data={approvalBreakdown.items} />
          <ul className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            {approvalBreakdown.items.map((item) => (
              <li key={item.key} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-900">{item.label}</p>
                <p>{item.value} ordens simuladas</p>
                <p>{item.percentage}% da carteira diária</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Casos sintéticos com justificativas completas</h2>
          <p className="text-sm text-slate-600">
            Os agentes documentam justificativas legíveis, regras KO acionadas, confiança residual e apontam para a ordem
            original para reprocessamento quando necessário.
          </p>
        </div>
        <div className="space-y-6">
          {cases.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>
                  {item.archetype === 'DIRECT'
                    ? 'Aprovação direta pela IA'
                    : item.archetype === 'FACTORY'
                    ? 'Aprovação após justificativa da fábrica'
                    : 'Exceção escalada para aprovação humana'}
                </CardTitle>
                <CardDescription>{item.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-900">Ordem {item.id}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Planta {item.plantId}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Risco: {(item.riskScore * 100).toFixed(0)}%</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Confiança IA: {(item.confidence * 100).toFixed(0)}%</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    Variância: {item.variancePct.toFixed(2)}% ({formatCurrency(item.varianceCurrency)})
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <h3 className="text-sm font-semibold text-slate-900">Por que o agente decidiu assim?</h3>
                  <p>
                    {item.archetype === 'DIRECT'
                      ? 'Score residual abaixo do limiar de risco (0,35). Nenhuma regra KO crítica foi violada e anexos obrigatórios foram validados.'
                      : item.archetype === 'FACTORY'
                      ? 'Motor detectou variância relevante (entre 8% e 15%) e acionou a fábrica para detalhar custos extras. Após checagem, aprovador humano liberou com ressalvas.'
                      : 'Violação de regra KO crítica e variância acima do limite seguro. Controle mantém reprovação até análise manual e revisão documental.'}
                  </p>
                </div>

                {item.justification ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <h4 className="font-semibold">Resumo da justificativa recebida</h4>
                    <p>{item.justification}</p>
                  </div>
                ) : null}

                <div className="space-y-2 text-sm text-slate-600">
                  <h3 className="text-sm font-semibold text-slate-900">Regras KO e evidências</h3>
                  {item.triggeredChecks.length > 0 ? (
                    <ul className="grid gap-2 md:grid-cols-2">
                      {item.triggeredChecks.map((check) => (
                        <li key={check.label} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                          <p className="font-semibold text-slate-900">{check.label}</p>
                          <p>{check.detail}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Sem violações críticas. Checklist completo.</p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <h3 className="text-sm font-semibold text-slate-900">Trilha de decisão</h3>
                  <ul className="space-y-2">
                    {item.decisionTrail.map((decision, index) => (
                      <li key={`${item.id}-${index}`} className="rounded-lg border border-slate-100 bg-white px-3 py-2">
                        <p className="font-semibold text-slate-900">{decision.actor}</p>
                        <p className="text-xs text-slate-400">{new Date(decision.createdAt).toLocaleString('pt-BR')}</p>
                        <p>{decision.action === 'APPROVE' ? 'Aprovou' : decision.action === 'REPROVE' ? 'Reprovou' : 'Solicitou mais informações'}</p>
                        <p className="text-slate-600">{decision.reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>Motor analítico: {item.modelVersion}</span>
                  <Link href={`${item.reconstructionUrl}?scene=historia`} className="text-brand">
                    Reconstruir fluxo completo →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
