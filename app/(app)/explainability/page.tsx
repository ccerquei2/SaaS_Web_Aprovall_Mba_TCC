import { Badge } from '@/components/ui/badge';

const explainabilityCases = [
  {
    id: 'WO-S2-4421',
    plant: 'Planta S2 – Boreal Alimentos',
    summary: 'Reprovação automática devido a variância agressiva e horas extras elevadas.',
    prediction: 'Sistema sugeriu reprovação automática.',
    narrative:
      'O modelo de aprovação automática sinalizou desvio financeiro e risco operacional combinados. O aprovador consegue ver quais regras KO foram avaliadas e por que o score final permaneceu acima do limite de 0,72.',
    rules: [
      {
        name: 'KO Variância S2',
        triggered: true,
        detail: 'Variância de materiais a +42% vs. limite de +30%.',
        tags: ['Financeiro', 'Segmento S2']
      },
      {
        name: 'Horas extras > 18%',
        triggered: true,
        detail: 'Turno adicional previsto em 22% da equipe.',
        tags: ['Produtividade', 'Overtime']
      },
      {
        name: 'Fornecedor homologado',
        triggered: false,
        detail: 'Fornecedor crítico com rating atualizado e sem incidentes.',
        tags: ['Compliance']
      }
    ]
  },
  {
    id: 'WO-M1-9034',
    plant: 'Planta M1 – Prisma Bebidas',
    summary: 'Aprovação com alerta narrativo para justificativa adicional.',
    prediction: 'Sistema sugeriu aprovação condicionada.',
    narrative:
      'Apesar do score permanecer em 0,58, o motor destacou as regras consultadas e recomendou reforçar justificativa sobre estoque crítico. Isso permite uma conversa transparente entre PCP e Controladoria.',
    rules: [
      {
        name: 'KO Estoque crítico',
        triggered: false,
        detail: 'Estoque de PET acima de 15 dias de cobertura.',
        tags: ['Supply Chain', 'Estoque']
      },
      {
        name: 'Tendência de margem',
        triggered: true,
        detail: 'Margem prevista -6% vs. média histórica de -2%.',
        tags: ['Financeiro', 'Margem']
      },
      {
        name: 'Pedido recorrente',
        triggered: true,
        detail: 'Histórico de execução em 7 dos últimos 9 meses.',
        tags: ['Histórico']
      }
    ]
  },
  {
    id: 'WO-N4-1189',
    plant: 'Planta N4 – Aurora Nutrientes',
    summary: 'Reprovação manual com suporte do motor de explicabilidade.',
    prediction: 'Sistema recomendou revisão manual prioritária.',
    narrative:
      'O motor destacou múltiplos riscos simultâneos e sinalizou que uma revisão manual evitaria impacto de R$ 480k. A trilha de auditoria guarda automaticamente as evidências.',
    rules: [
      {
        name: 'KO Sensibilidade do cliente',
        triggered: true,
        detail: 'Cliente estratégico com cláusula de SLA rígida.',
        tags: ['Cliente', 'Contrato']
      },
      {
        name: 'KO Alçada financeira',
        triggered: true,
        detail: 'Solicitação acima de R$ 250k exige segunda assinatura.',
        tags: ['Financeiro', 'Governança']
      },
      {
        name: 'Compliance ambiental',
        triggered: false,
        detail: 'Documento de emissão atualizado e válido.',
        tags: ['Compliance']
      }
    ]
  }
];

export default function ExplainabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Explicabilidade do motor de aprovação</h1>
        <p className="text-sm text-slate-600">
          Casos sintéticos que demonstram como as regras KO, scores e narrativas colaboram para decisões justificáveis.
        </p>
      </div>
      <div className="space-y-6">
        {explainabilityCases.map((item) => (
          <section key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">{item.id}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{item.plant}</h2>
                <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p className="font-medium text-slate-900">{item.prediction}</p>
                <p className="mt-1 text-xs uppercase">Narrativa disponível</p>
              </div>
            </header>
            <p className="mt-4 text-sm text-slate-600">{item.narrative}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {item.rules.map((rule) => (
                <div key={rule.name} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{rule.name}</h3>
                    <Badge
                      tone={rule.triggered ? 'danger' : 'success'}
                      className={rule.triggered ? undefined : 'border border-success/40 bg-transparent text-success'}
                    >
                      {rule.triggered ? 'Acionada' : 'Não acionada'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{rule.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rule.tags.map((tag) => (
                      <Badge
                        key={tag}
                        tone="info"
                        className="border border-brand/40 bg-transparent text-brand"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
