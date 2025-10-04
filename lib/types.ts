export type Segment = 'S1' | 'S2' | 'S3' | 'S4';
export type Role = 'USER' | 'APPROVER' | 'DECIDER' | 'GATEKEEPER';

export interface Company {
  id: string;
  name: string;
  segment: Segment;
  plants: Plant[];
}

export interface Plant {
  id: string;
  name: string;
  region: string;
  companyId: string;
  segment: Segment;
}

export type WorkOrderStatus = 'PENDING' | 'NEEDS_JUSTIFICATION' | 'APPROVED' | 'REPROVED';

export interface WorkOrder {
  id: string;
  plantId: string;
  segment: Segment;
  createdAt: string;
  closedAt?: string;
  qty: number;
  stdCost: number;
  actualCost: number;
  variancePct: number;
  status: WorkOrderStatus;
  koChecks: Array<{ key: string; label: string; passed: boolean; detail?: string }>;
  riskScore: number;
  justifications: Justification[];
  decisions: Decision[];
  attachments: Array<{ id: string; name: string; url: string }>;
  timeline: TimelineEvent[];
}

export interface Justification {
  id: string;
  authorRole: Role;
  text: string;
  createdAt: string;
}

export interface Decision {
  id: string;
  actorRole: Role;
  action: 'APPROVE' | 'REPROVE' | 'REQUEST_INFO';
  reason: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  type:
    | 'CREATED'
    | 'KO_CHECK'
    | 'JUSTIFICATION'
    | 'DECISION'
    | 'SYSTEM_UPDATE';
  label: string;
  description: string;
  createdAt: string;
}

export interface RuleKO {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  threshold?: number;
  description: string;
  tags: string[];
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: Role;
  action: string;
  detail: string;
  createdAt: string;
  plantId: string;
  workOrderId?: string;
  ruleKey?: string;
}

export interface Dataset {
  companies: Company[];
  plants: Plant[];
  workOrders: WorkOrder[];
  rules: RuleKO[];
  auditLogs: AuditLogEntry[];
}
