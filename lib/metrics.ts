import { getDataset } from './store';

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

export function getSegmentMix() {
  const { workOrders } = getDataset();
  const totals = workOrders.reduce<Record<string, number>>((acc, order) => {
    acc[order.segment] = (acc[order.segment] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(totals).map(([segment, value]) => ({ segment, value }));
}

export function getApprovalPathSimulation() {
  const { workOrders } = getDataset();

  const baselineDirect = workOrders.filter(
    (order) => order.justifications.length === 0 && order.riskScore < 0.45
  ).length;
  const baselineFactory = workOrders.filter((order) => order.justifications.length > 0).length;
  const baselineManual = workOrders.filter(
    (order) => order.justifications.length === 0 && order.riskScore >= 0.45
  ).length;

  const total = workOrders.length;
  const simulatedDirect = Math.round(total * 0.58);
  const simulatedFactory = Math.round(total * 0.3);
  const simulatedManual = total - simulatedDirect - simulatedFactory;

  return [
    {
      stage: 'Aprovação direta',
      baseline: baselineDirect,
      simulated: simulatedDirect
    },
    {
      stage: 'Justificativa obrigatória da fábrica',
      baseline: baselineFactory,
      simulated: simulatedFactory
    },
    {
      stage: 'Exceções (Aprovação humana)',
      baseline: baselineManual,
      simulated: simulatedManual
    }
  ];
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

export function getExplainabilityCases(limit = 8) {
  const { workOrders, rules } = getDataset();
  const activeRules = new Map(rules.map((rule) => [rule.key, rule]));

  return [...workOrders]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, limit)
    .map((order) => {
      const failingChecks = order.koChecks.filter((check) => !check.passed);
      const latestDecision = order.decisions[order.decisions.length - 1];
      const confidence = Math.max(0.52, Number((1 - order.riskScore * 0.55).toFixed(2)));
      const evidence = failingChecks.length
        ? failingChecks.map((check) =>
            activeRules.has(check.key)
              ? `${check.label}: ${activeRules.get(check.key)!.description}`
              : check.detail ?? check.label
          )
        : [`Desvio positivo controlado em ${order.variancePct.toFixed(2)}%`];

      return {
        id: order.id,
        plantId: order.plantId,
        riskScore: Number(order.riskScore.toFixed(2)),
        variancePct: order.variancePct,
        modelVersion: 'v2.4.1-sim',
        confidence: Number((confidence * 100).toFixed(0)),
        decision: latestDecision
          ? {
              actorRole: latestDecision.actorRole,
              action: latestDecision.action,
              reason: latestDecision.reason
            }
          : null,
        justification: order.justifications[0]?.text,
        evidence,
        rules: failingChecks.map((check) => ({
          key: check.key,
          label: check.label
        }))
      };
    });
}
