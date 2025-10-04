'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WorkOrderDetailProps {
  order: any;
}

export function WorkOrderDetail({ order }: WorkOrderDetailProps) {
  const [current, setCurrent] = useState(order);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function postJustification() {
    if (!message) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${current.id}/justify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Falha ao enviar justificativa.');
      setCurrent(payload.data);
      setMessage('');
      setFeedback('Justificativa registrada. Veja a linha do tempo atualizada.');
    } catch (error) {
      setFeedback((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function decide(action: 'APPROVE' | 'REPROVE') {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${current.id}/${action === 'APPROVE' ? 'approve' : 'reprove'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: action === 'APPROVE' ? 'Aprovação manual com respaldo de justificativa.' : 'Reprovação manual após revisão de risco.' })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Falha ao registrar decisão.');
      setCurrent(payload.data);
      setFeedback('Decisão registrada e trilha de auditoria atualizada.');
    } catch (error) {
      setFeedback((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{current.id}</h2>
            <p className="text-sm text-slate-500">Planta {current.plantId} · Segmento {current.segment}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={current.status === 'APPROVED' ? 'success' : current.status === 'REPROVED' ? 'danger' : 'warning'}>
              {current.status}
            </Badge>
            <Badge tone={current.riskScore > 0.7 ? 'danger' : current.riskScore > 0.5 ? 'warning' : 'info'}>
              Risco {current.riskScore.toFixed(2)}
            </Badge>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-4 text-sm text-slate-600">
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-400">Criada</span>
            <span>{new Date(current.createdAt).toLocaleString('pt-BR')}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-400">Encerrada</span>
            <span>{new Date(current.closedAt).toLocaleString('pt-BR')}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-400">Quantidades</span>
            <span>{current.qty} unidades</span>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-slate-400">Variância</span>
            <span className={Math.abs(current.variancePct) > 15 ? 'text-danger font-semibold' : ''}>
              {current.variancePct.toFixed(2)}%
            </span>
          </div>
        </div>
      </section>

      {feedback ? <div className="rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm text-brand">{feedback}</div> : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-900">Checagens KO</h3>
            <div className="mt-3 space-y-3 text-sm text-slate-600">
              {current.koChecks.map((check: any) => (
                <div key={check.key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2">
                  <div>
                    <p className="font-medium text-slate-900">{check.label}</p>
                    <p className="text-xs text-slate-500">{check.detail}</p>
                  </div>
                  <Badge tone={check.passed ? 'success' : 'danger'}>{check.passed ? 'OK' : 'KO'}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-900">Linha do tempo</h3>
            <ol className="mt-3 space-y-3 text-sm text-slate-600">
              {current.timeline.map((event: any) => (
                <li key={event.id} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{event.label}</span>
                    <span className="text-xs text-slate-400">{new Date(event.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-xs text-slate-500">{event.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-900">Justificativas</h3>
            <div className="space-y-3 text-sm text-slate-600">
              {current.justifications.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhuma justificativa enviada.</p>
              ) : (
                current.justifications.map((item: any) => (
                  <div key={item.id} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                    <p className="font-medium text-slate-900">{item.authorRole}</p>
                    <p>{item.text}</p>
                    <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 space-y-3">
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                rows={3}
                placeholder="Adicionar justificativa..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <Button type="button" onClick={postJustification} disabled={loading || !message}>
                Enviar justificativa
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-900">Decisão</h3>
            <p className="text-sm text-slate-600">
              Risco {current.riskScore.toFixed(2)} e variância {current.variancePct.toFixed(2)}%.
            </p>
            <div className="mt-4 space-y-3">
              <Button type="button" onClick={() => decide('APPROVE')} disabled={loading}>
                Aprovar ordem
              </Button>
              <Button type="button" onClick={() => decide('REPROVE')} disabled={loading} className="bg-danger hover:bg-danger/80">
                Reprovar ordem
              </Button>
              <Button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Ordem ${current.id} – status ${current.status}. Variância ${current.variancePct.toFixed(2)}%. Risco ${current.riskScore.toFixed(2)}.`
                  );
                  setFeedback('Resumo da decisão copiado para a área de transferência.');
                }}
                className="bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Copiar resumo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
