import { getDataset } from './store';
import type { WorkOrder } from './types';

const MODEL_VERSION = 'Aurora-v1.3-sim';

export function getKpis() {
  const { workOrders } = getDataset();
  const total = workOrders.length;
  const approved = workOrders.filter((order) => order.status === 'APPROVED').length;
  const pending = workOrders.filter((order) => order.status === 'PENDING').length;
  const reproved = workOrders.filter((order) => order.status === 'REPROVED').length;
  const needsJustification = workOrders.filter((order) => order.status === 'NEEDS_JUSTIFICATION').length;

  const cycleTime = Number(
    (
      workOrders.reduce((acc, order) => acc + (new Date(order.closedAt ?? Date.now()).getTime() - new Date(order.createdAt).getTime()), 0) /
      (total || 1) /
      3600000
    ).toFixed(1)
  );

  const firstPassRate = Number(((approved / (total || 1)) * 100).toFixed(1));

  const reprovalByKo = Number(((reproved / (total || 1)) * 100).toFixed(1));

  return {
    total,
    approved,
    pending,
    needsJustification,
    reproved,
    cycleTime,
    firstPassRate,
    reprovalByKo
  };
}

export function getApprovalFlowBreakdown() {
  const { workOrders } = getDataset();

  const directApprovals = workOrders.filter(
    (order) => order.status === 'APPROVED' && order.justifications.length === 0
  ).length;
  const factoryApprovals = workOrders.filter(
    (order) => order.status === 'APPROVED' && order.justifications.length > 0
  ).length;
  const exceptionApprovals = workOrders.filter((order) => order.status !== 'APPROVED').length;

  const normalizedExceptions = Math.max(exceptionApprovals, Math.ceil(workOrders.length * 0.05));
  const normalizedFactory = Math.max(factoryApprovals, normalizedExceptions + Math.max(3, Math.round(normalizedExceptions * 0.35)));
  const normalizedDirect = Math.max(
    directApprovals,
    normalizedFactory + Math.max(5, Math.round(normalizedFactory * 0.25))
  );

  const total = normalizedDirect + normalizedFactory + normalizedExceptions;

  const items = [
    {
      key: 'direct' as const,
      label: 'Aprovação direta',
      value: normalizedDirect,
      percentage: Number(((normalizedDirect / total) * 100).toFixed(1)),
      color: '#0ea5e9'
    },
    {
      key: 'factory' as const,
      label: 'Justificativa obrigatória (fábrica)',
      value: normalizedFactory,
      percentage: Number(((normalizedFactory / total) * 100).toFixed(1)),
      color: '#f97316'
    },
    {
      key: 'exception' as const,
      label: 'Exceções (aprovação humana)',
      value: normalizedExceptions,
      percentage: Number(((normalizedExceptions / total) * 100).toFixed(1)),
      color: '#334155'
    }
  ];

  return { total, items };
}

export function getTrendData() {
  const { workOrders } = getDataset();
  const daily = new Map<string, { approvals: number; reprovals: number; pending: number }>();
  workOrders.forEach((order) => {
    const key = order.createdAt.slice(0, 10);
    if (!daily.has(key)) {
      daily.set(key, { approvals: 0, reprovals: 0, pending: 0 });
    }
    const bucket = daily.get(key)!;
    if (order.status === 'APPROVED') bucket.approvals += 1;
    if (order.status === 'REPROVED') bucket.reprovals += 1;
    if (order.status === 'PENDING') bucket.pending += 1;
  });
  return Array.from(daily.entries())
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([date, value]) => ({ date, ...value }));
}

export function getTodayAnomalies(limit = 5) {
  const { workOrders } = getDataset();
  return workOrders
    .filter((order) => order.riskScore > 0.6)
    .slice(0, limit)
    .map((order) => ({
      id: order.id,
      plantId: order.plantId,
      riskScore: order.riskScore,
      variancePct: order.variancePct,
      status: order.status
    }));
}

function pickOrder(orders: WorkOrder[], predicate: (order: WorkOrder) => boolean) {
  return orders.find(predicate) ?? orders[0];
}

export function getExplainabilityCases() {
  const { workOrders } = getDataset();

  if (!workOrders.length) {
    return [];
  }

  const directOrder = pickOrder(workOrders, (order) => order.status === 'APPROVED' && order.justifications.length === 0);
  const factoryOrder = pickOrder(workOrders, (order) => order.justifications.length > 0);
  const exceptionOrder = pickOrder(workOrders, (order) => order.status !== 'APPROVED');

  const buildCase = (order: WorkOrder, archetype: 'DIRECT' | 'FACTORY' | 'EXCEPTION') => {
    const varianceCurrency = order.actualCost - order.stdCost;
    const triggeredChecks = order.koChecks.filter((check) => !check.passed);

    const roleLabels: Record<string, string> = {
      USER: 'PCP / Fábrica',
      APPROVER: 'Controladoria',
      DECIDER: 'Diretoria',
      GATEKEEPER: 'Gatekeeper'
    };

    const archetypeSummary: Record<'DIRECT' | 'FACTORY' | 'EXCEPTION', string> = {
      DIRECT:
        'Motor liberou automaticamente porque risco residual ficou baixo e nenhuma regra KO crítica foi violada.',
      FACTORY:
        'A IA solicitou reforço documental, fábrica anexou justificativa e a aprovação foi concedida com ressalvas.',
      EXCEPTION:
        'Regras KO críticas foram quebradas. O agente escalou para aprovação humana e manteve bloqueio preventivo.'
    } as const;

    return {
      id: order.id,
      plantId: order.plantId,
      archetype,
      summary: archetypeSummary[archetype],
      variancePct: order.variancePct,
      varianceCurrency,
      riskScore: order.riskScore,
      confidence: Number((1 - Math.min(order.riskScore, 0.95)).toFixed(2)),
      justification: order.justifications[0]?.text,
      triggeredChecks: triggeredChecks.map((check) => ({ label: check.label, detail: check.detail })),
      decisionTrail: order.decisions.map((decision) => ({
        actor: roleLabels[decision.actorRole] ?? decision.actorRole,
        action: decision.action,
        reason: decision.reason,
        createdAt: decision.createdAt
      })),
      reconstructionUrl: `/orders/${order.id}`,
      modelVersion: MODEL_VERSION
    };
  };

  return [
    buildCase(directOrder, 'DIRECT'),
    buildCase(factoryOrder, 'FACTORY'),
    buildCase(exceptionOrder, 'EXCEPTION')
  ];
}
