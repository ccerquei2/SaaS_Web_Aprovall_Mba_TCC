import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-16">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Analisa IA – Aprovação Automática de Ordens de Serviço
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          MBA em Tecnologia para Negócios: AI, Data Science e Big Data  - Aprovação de Ordens de Produção Assistida por IA
          Este trabalho apresenta um MVP conceitual, construído com dados sintéticos, que simula uma aplicação SaaS voltada à aceleração 
          da análise de custos de produção, aprovação de ordens, redução de riscos e garantia de conformidade, utilizando agentes de Inteligência Artificial.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Entenda o desafio</h3>
            <p className="mt-3 text-sm text-slate-600">
              Veja como segmentamos as plantas, medimos riscos e conectamos regras KO com inteligência analítica.
            </p>
            <Link href="#sobre" className="mt-4 inline-flex text-sm font-semibold text-brand">
              Explorar diagnóstico →
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Testar o sandbox</h3>
            <p className="mt-3 text-sm text-slate-600">
              Navegue por filas, revise justificativas e aprove ordens com trilha de auditoria completa.
            </p>
            <Link href="/dashboard" className="mt-4 inline-flex text-sm font-semibold text-brand">
              Abrir sandbox →
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Comprar / Planos</h3>
            <p className="mt-3 text-sm text-slate-600">
              Pacotes flexíveis para rollout por planta, com governança e suporte a auditorias 24/7.
            </p>
            <Link href="#planos" className="mt-4 inline-flex text-sm font-semibold text-brand">
              Ver opções →
            </Link>
          </div>
        </div>
        <div id="sobre" className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Como informamos, testamos e vendemos</h2>
          <p className="mt-4 text-sm text-slate-600">
            Para fins de demonstração, foi desenvolvido este MVP conceitual, sem integração com bancos de dados ou APIs reais, 
            destinado a apresentar o fluxo das telas e validar o desenho funcional proposto.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            <li className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase text-slate-500">Informar</h3>
              <p className="mt-2 text-sm text-slate-600">
                Relatórios narrativos explicam riscos, KOs e impactos financeiros em linguagem acessível.
              </p>
            </li>
            <li className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase text-slate-500">Testar</h3>
              <p className="mt-2 text-sm text-slate-600">
                Modo sandbox com feedback instantâneo, justificativas colaborativas e trilha de auditoria.
              </p>
            </li>
            <li className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase text-slate-500">Comprar</h3>
              <p className="mt-2 text-sm text-slate-600">
                Planos modulares com SLA definido, DPA pronto e saída de dados garantida.
              </p>
            </li>
          </ul>
        </div>
        <div id="planos" className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Piloto Controlado</h3>
            <p className="mt-2 text-sm text-slate-600">2 plantas, suporte remoto e ajustes nas regras KO.</p>
            <p className="mt-4 text-2xl font-bold text-slate-900">R$ 18k / mês</p>
          </div>
          <div className="rounded-2xl border-2 border-brand bg-white p-6 text-left shadow shadow-brand/20">
            <h3 className="text-lg font-semibold text-slate-900">Programa Scale-up</h3>
            <p className="mt-2 text-sm text-slate-600">Até 8 plantas, governança comitê mensal e integrações TI.</p>
            <p className="mt-4 text-2xl font-bold text-slate-900">R$ 42k / mês</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Enterprise 24/7</h3>
            <p className="mt-2 text-sm text-slate-600">Multi-país, cobertura 24/7 e experimentos controlados trimestrais.</p>
            <p className="mt-4 text-2xl font-bold text-slate-900">Sob consulta</p>
          </div>
        </div>
        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:shadow-brand/40"
          >
            Abrir sandbox agora
          </Link>
        </div>
      </div>
    </main>
  );
}
