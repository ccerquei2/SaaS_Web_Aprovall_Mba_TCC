const pillars = [
  {
    title: 'Redução de lead time',
    detail: 'Automação das KOs libera 68% das ordens sem intervenção humana com base em variância e risco.'
  },
  {
    title: 'Governança auditável',
    detail: 'Trilha completa com justificativas, decisões e exportação pronta para auditores e conselhos.'
  },
  {
    title: 'Escala SaaS industrial',
    detail: 'Segmentação S1–S4 replica a realidade de farmacêuticas, alimentos e plantas 24/7.'
  }
];

export default function PrintValuePropPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-slate-900">Analisa IA – Value Prop para TCC</h1>
        <p className="mt-2 text-sm text-slate-500">
          MVP navegável, 100% sintético, para ilustrar aprovação automática de ordens industriais.
        </p>
      </section>
      <section className="grid grid-cols-3 gap-4 text-sm">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-900">{pillar.title}</h2>
            <p className="mt-2 text-slate-600">{pillar.detail}</p>
          </div>
        ))}
      </section>
      <section className="rounded-xl border border-slate-200 p-4 text-sm">
        <h2 className="text-lg font-semibold text-slate-900">Fluxo resumido</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-slate-600">
          <li>PCP envia ordem com anexos sintéticos e passa pelo motor KO.</li>
          <li>Ordens abaixo de 5% de variância são aprovadas automaticamente.</li>
          <li>Ordens entre 5% e 15% pedem justificativa e seguem para Controladoria.</li>
          <li>Acima de 15%, reprovação preventiva até diretoria avaliar.</li>
          <li>Decisão final alimenta a trilha de auditoria e os dashboards de impressão.</li>
        </ol>
      </section>
      <section className="rounded-xl border border-slate-200 p-4 text-sm">
        <h2 className="text-lg font-semibold text-slate-900">Call to action</h2>
        <p>
          Use o botão “Screenshot Mode” na aplicação principal para capturar estas telas em alta definição para o TCC.
        </p>
      </section>
    </div>
  );
}
