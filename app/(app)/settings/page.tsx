import Link from 'next/link';

const providers = [
  { name: 'LLM Provider', value: 'Analisa Synthetic LLM v0.4', status: 'Simulado localmente' },
  { name: 'ERP / SAP', value: 'Connector sandbox', status: 'Mock in-memory' },
  { name: 'E-mail / Alerta', value: 'Fila SMTP fake', status: 'Mensagens não enviadas' }
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Configurações e governança</h1>
        <p className="text-sm text-slate-600">
          Todas as integrações estão desativadas nesta demo. Use esta página como roteiro de discussões de rollout.
        </p>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Provedores simulados</h2>
        <ul className="mt-3 space-y-3 text-sm text-slate-600">
          {providers.map((provider) => (
            <li key={provider.name} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="font-medium text-slate-900">{provider.name}</p>
              <p>{provider.value}</p>
              <p className="text-xs text-slate-400">{provider.status}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">SLAs e DPA</h2>
        <p className="mt-2 text-sm text-slate-600">
          SLA alvo 24/7 com resposta em 30 minutos. Link do DPA disponível para demonstração.
        </p>
        <Link href="#" className="mt-3 inline-flex text-sm font-semibold text-brand">
          Visualizar DPA sintético →
        </Link>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-600">
          Escrow: contrato de custódia digital pronto para assinatura. Tooltip disponível nas telas do app.
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Saídas e portabilidade de dados</h2>
        <p className="mt-2 text-sm text-slate-600">
          Gere o dataset sintético completo em JSON para auditorias.
        </p>
        <a
          href="/api/export"
          className="mt-3 inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Baixar dataset JSON
        </a>
      </section>
    </div>
  );
}
