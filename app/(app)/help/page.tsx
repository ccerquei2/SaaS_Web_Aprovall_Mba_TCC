const faq = [
  {
    question: 'O que é KO?',
    answer: 'KO (Knockout) são regras rígidas que impedem aprovação automática quando critérios críticos não são atendidos.'
  },
  {
    question: 'Como o risco é calculado?',
    answer:
      'O score combina variância financeira, horas extras e sensibilidade do segmento. É determinístico para manter a demo estável.'
  },
  {
    question: 'Existe integração real com ERP ou IA?',
    answer: 'Não. Todo dado exibido é sintético, gerado localmente pelo seed.ts com base em empresas fictícias.'
  }
];

const glossary = [
  { term: 'KO', definition: 'Regra crítica que bloqueia ou exige justificativas em ordens suspeitas.' },
  { term: 'Risk Score', definition: 'Indicador de 0 a 1 usado para priorizar fila e aprovações.' },
  { term: 'DMU', definition: 'Decision Making Unit: conjunto de papéis (PCP, Controladoria, Diretoria, TI) envolvidos na decisão.' }
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Ajuda, glossário e aviso de demo</h1>
        <p className="text-sm text-slate-600">
          Use este roteiro para explicar o fluxo em apresentações. A demo é 100% sintética e não coleta dados reais.
        </p>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">FAQ rápido</h2>
        <dl className="mt-3 space-y-4 text-sm text-slate-600">
          {faq.map((item) => (
            <div key={item.question}>
              <dt className="font-semibold text-slate-900">{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Glossário</h2>
        <dl className="mt-3 grid gap-4 md:grid-cols-2 text-sm text-slate-600">
          {glossary.map((item) => (
            <div key={item.term} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
              <dt className="font-semibold text-slate-900">{item.term}</dt>
              <dd>{item.definition}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
        <p className="font-semibold">Demo only / Dados sintéticos</p>
        <p>
          Nenhuma integração com sistemas reais é executada. Use livremente em comitês executivos sem risco de
          exposição.
        </p>
      </section>
    </div>
  );
}
