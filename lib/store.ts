import { dataset as initialDataset, regenerateDataset } from './seed';
import { Dataset, Justification, Decision, RuleKO } from './types';

let dataset: Dataset = initialDataset;

export function getDataset(): Dataset {
  return dataset;
}

export function resetDataset(seed?: number) {
  dataset = regenerateDataset(seed ?? 42);
  return dataset;
}

export function getWorkOrders() {
  return dataset.workOrders;
}

export function getWorkOrderById(id: string) {
  return dataset.workOrders.find((order) => order.id === id);
}

export function addJustification(workOrderId: string, justification: Justification) {
  const order = getWorkOrderById(workOrderId);
  if (!order) return null;
  order.justifications.push(justification);
  order.timeline.push({
    id: `${workOrderId}-TL-J${order.justifications.length}`,
    type: 'JUSTIFICATION',
    label: 'Nova justificativa',
    description: justification.text,
    createdAt: justification.createdAt
  });
  dataset.auditLogs.push({
    id: `${workOrderId}-AUD-J${order.justifications.length}`,
    actor: 'PCP / Fábrica',
    role: 'USER',
    action: 'Justificativa enviada',
    detail: justification.text,
    createdAt: justification.createdAt,
    plantId: order.plantId,
    workOrderId
  });
  return order;
}

export function appendDecision(workOrderId: string, decision: Decision) {
  const order = getWorkOrderById(workOrderId);
  if (!order) return null;
  order.decisions.push(decision);
  order.status = decision.action === 'APPROVE' ? 'APPROVED' : 'REPROVED';
  order.timeline.push({
    id: `${workOrderId}-TL-D${order.decisions.length}`,
    type: 'DECISION',
    label: `Decisão ${decision.action === 'APPROVE' ? 'Aprovada' : 'Reprovada'}`,
    description: decision.reason,
    createdAt: decision.createdAt
  });
  dataset.auditLogs.push({
    id: `${workOrderId}-AUD-D${order.decisions.length}`,
    actor: decision.actorRole === 'APPROVER' ? 'Controladoria' : 'Diretoria',
    role: decision.actorRole,
    action: `Decisão ${decision.action}`,
    detail: decision.reason,
    createdAt: decision.createdAt,
    plantId: order.plantId,
    workOrderId
  });
  return order;
}

export function updateRule(rule: RuleKO) {
  const index = dataset.rules.findIndex((item) => item.id === rule.id);
  if (index >= 0) {
    dataset.rules[index] = rule;
  } else {
    dataset.rules.push(rule);
  }
  return dataset.rules;
}

export function listRules() {
  return dataset.rules;
}

export function listAuditLogs() {
  return dataset.auditLogs;
}
