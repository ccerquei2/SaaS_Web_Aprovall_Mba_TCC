import { Dataset, WorkOrderStatus, RuleKO, AuditLogEntry, WorkOrder, TimelineEvent, Plant, Decision, Justification } from './types';

function createSeededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const baseCompanies: Array<{
  id: string;
  name: string;
  segment: 'S1' | 'S2' | 'S3' | 'S4';
  plantCount: number;
  regions: string[];
}> = [
  { id: 'C-NEB', name: 'Nebula Farma', segment: 'S1', plantCount: 3, regions: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais'] },
  { id: 'C-BOR', name: 'Boreal Alimentos', segment: 'S2', plantCount: 4, regions: ['Paraná', 'Santa Catarina', 'Rio Grande do Sul', 'São Paulo'] },
  { id: 'C-DEL', name: 'Delta MetalWorks', segment: 'S3', plantCount: 3, regions: ['Minas Gerais', 'Bahia', 'Pernambuco'] },
  { id: 'C-PRI', name: 'Prisma Bebidas', segment: 'S2', plantCount: 4, regions: ['São Paulo', 'Rio de Janeiro', 'Bahia', 'Pará'] },
  { id: 'C-QUI', name: 'QuimicPlus', segment: 'S1', plantCount: 3, regions: ['Rio Grande do Sul', 'Paraná', 'São Paulo'] },
  { id: 'C-ALT', name: 'Altamar Logística', segment: 'S4', plantCount: 3, regions: ['Amazonas', 'Ceará', 'Pernambuco'] },
  { id: 'C-SYN', name: 'Synthex Têxteis', segment: 'S3', plantCount: 2, regions: ['Rio Grande do Norte', 'Paraíba'] },
  { id: 'C-ORB', name: 'Orbital Agro', segment: 'S4', plantCount: 2, regions: ['Mato Grosso', 'Goiás'] }
];

const baseRules: RuleKO[] = [
  {
    id: 'RULE-001',
    key: 'variance_over_10',
    name: 'Variância acima de 10%',
    enabled: true,
    threshold: 10,
    description: 'Solicitar justificativa quando a variância real ultrapassa 10% do custo padrão.',
    tags: ['custo', 'financeiro']
  },
  {
    id: 'RULE-002',
    key: 'missing_attachment',
    name: 'Falta de comprovantes',
    enabled: true,
    description: 'Bloqueia ordens sem comprovantes obrigatórios anexados.',
    tags: ['compliance', 'documentação']
  },
  {
    id: 'RULE-003',
    key: 'overtime_peak',
    name: 'Horas extras em pico sazonal',
    enabled: true,
    description: 'Reprova automaticamente ordens com horas extras fora da janela autorizada.',
    tags: ['overtime', 'sazonalidade']
  },
  {
    id: 'RULE-004',
    key: 'supply_risk',
    name: 'Risco de fornecedor crítico',
    enabled: false,
    description: 'Sinaliza ordens ligadas a fornecedores com score de risco elevado.',
    tags: ['fornecedor', 'risco']
  }
];

function riskScoreFor(order: WorkOrder): number {
  const base = Math.abs(order.variancePct) / 100;
  const koPenalty = order.koChecks.filter((check) => !check.passed).length * 0.08;
  const segmentWeight = {
    S1: 0.2,
    S2: 0.12,
    S3: 0.18,
    S4: 0.15
  }[order.segment];
  return Math.min(1, Number((base + koPenalty + segmentWeight).toFixed(2)));
}

function generateDataset(seed = 42): Dataset {
  const random = createSeededRandom(seed);
  const companies = baseCompanies.map((company) => ({
    ...company,
    plants: [] as Plant[]
  }));
  const plants: Plant[] = [];

  companies.forEach((company) => {
    for (let index = 0; index < company.plantCount; index += 1) {
      const plantId = `${company.id}-PL${index + 1}`;
      const region = company.regions[index % company.regions.length];
      const plant = {
        id: plantId,
        name: `${company.name.split(' ')[0]} Unidade ${index + 1}`,
        region,
        companyId: company.id,
        segment: company.segment
      } satisfies Plant;
      plants.push(plant);
      company.plants.push(plant);
    }
  });

  const workOrders: WorkOrder[] = [];
  const auditLogs: AuditLogEntry[] = [];

  const koTemplates = [
    { key: 'variance', label: 'Checagem de variância' },
    { key: 'overtime', label: 'Horas extras' },
    { key: 'materials', label: 'Materiais críticos' },
    { key: 'safety', label: 'Conformidade de segurança' }
  ];

  plants.forEach((plant) => {
    const ordersPerPlant = 24 + Math.floor(random() * 8);
    for (let index = 0; index < ordersPerPlant; index += 1) {
      const stdCost = 12000 + Math.floor(random() * 9000);
      const varianceFactor = (random() - 0.45) * 0.4; // -18% a +22%
      const actualCost = Math.round(stdCost * (1 + varianceFactor));
      const variancePct = Number((((actualCost - stdCost) / stdCost) * 100).toFixed(2));
      const id = `${plant.id}-WO-${String(index + 1).padStart(3, '0')}`;
      const createdAt = new Date(Date.now() - Math.floor(random() * 60) * 86400000 + index * 7200000);

      const koChecks = koTemplates.map((template, templateIndex) => ({
        key: template.key,
        label: template.label,
        passed: variancePct < 12 ? templateIndex !== 1 : random() > 0.35,
        detail:
          template.key === 'variance'
            ? `Desvio registrado em ${variancePct.toFixed(2)}%`
            : template.key === 'overtime'
            ? 'Horas extras lançadas na janela noturna.'
            : template.key === 'materials'
            ? 'Material crítico com lead time > 20 dias.'
            : 'Checklist de segurança atualizado.'
      }));

      let status: WorkOrderStatus = 'PENDING';
      if (Math.abs(variancePct) < 5 && koChecks.every((check) => check.passed)) {
        status = 'APPROVED';
      } else if (Math.abs(variancePct) < 15) {
        status = 'NEEDS_JUSTIFICATION';
      } else if (Math.abs(variancePct) >= 15) {
        status = 'REPROVED';
      }

      const baseTimeline: TimelineEvent[] = [
        {
          id: `${id}-TL1`,
          type: 'CREATED',
          label: 'Ordem criada',
          description: `Ordem aberta pela fábrica ${plant.name}.`,
          createdAt: createdAt.toISOString()
        },
        {
          id: `${id}-TL2`,
          type: 'KO_CHECK',
          label: 'Regras KO avaliadas',
          description: 'Sistema aplicou checagens obrigatórias.',
          createdAt: new Date(createdAt.getTime() + 3600000).toISOString()
        }
      ];

      const justifications: Justification[] = [];
      const decisions: Decision[] = [];

      if (status === 'NEEDS_JUSTIFICATION') {
        const justification = {
          id: `${id}-J1`,
          authorRole: 'USER' as const,
          text: 'Ajuste de lote piloto para atender pedido emergencial. Custos extras cobertos pelo cliente.',
          createdAt: new Date(createdAt.getTime() + 5400000).toISOString()
        };
        justifications.push(justification);
        baseTimeline.push({
          id: `${id}-TL3`,
          type: 'JUSTIFICATION',
          label: 'Justificativa recebida',
          description: justification.text,
          createdAt: justification.createdAt
        });
        decisions.push({
          id: `${id}-D1`,
          actorRole: 'APPROVER',
          action: 'APPROVE',
          reason: 'Justificativa aceita. Variância alinhada com contrato específico.',
          createdAt: new Date(createdAt.getTime() + 7200000).toISOString()
        });
        baseTimeline.push({
          id: `${id}-TL4`,
          type: 'DECISION',
          label: 'Aprovado após justificativa',
          description: 'Aprovador validou justificativa e seguiu com aprovação.',
          createdAt: new Date(createdAt.getTime() + 7200000).toISOString()
        });
        status = 'APPROVED';
      } else if (status === 'REPROVED') {
        decisions.push({
          id: `${id}-D1`,
          actorRole: 'APPROVER',
          action: 'REPROVE',
          reason: 'Variância acima de 15% sem respaldo documental.',
          createdAt: new Date(createdAt.getTime() + 7200000).toISOString()
        });
        baseTimeline.push({
          id: `${id}-TL3`,
          type: 'DECISION',
          label: 'Reprovada automaticamente',
          description: 'Sistema manteve reprovação por violar regra KO crítica.',
          createdAt: new Date(createdAt.getTime() + 7200000).toISOString()
        });
      } else if (status === 'APPROVED') {
        decisions.push({
          id: `${id}-D1`,
          actorRole: 'APPROVER',
          action: 'APPROVE',
          reason: 'Aprovado automaticamente com base em variância dentro do limite.',
          createdAt: new Date(createdAt.getTime() + 5400000).toISOString()
        });
        baseTimeline.push({
          id: `${id}-TL3`,
          type: 'DECISION',
          label: 'Aprovado automaticamente',
          description: 'Sistema autorizou a ordem por estar dentro dos parâmetros.',
          createdAt: new Date(createdAt.getTime() + 5400000).toISOString()
        });
      }

      const order: WorkOrder = {
        id,
        plantId: plant.id,
        segment: plant.segment,
        createdAt: createdAt.toISOString(),
        closedAt: new Date(createdAt.getTime() + 86400000).toISOString(),
        qty: 400 + Math.floor(random() * 200),
        stdCost,
        actualCost,
        variancePct,
        status,
        koChecks,
        riskScore: 0,
        justifications,
        decisions,
        attachments: [
          { id: `${id}-AT1`, name: 'Orçamento aprovado.pdf', url: '#' },
          { id: `${id}-AT2`, name: 'Checklist de segurança.xlsx', url: '#' }
        ],
        timeline: baseTimeline
      };

      order.riskScore = riskScoreFor(order);

      workOrders.push(order);

      auditLogs.push({
        id: `${id}-A1`,
        actor: 'Motor Analítico',
        role: 'APPROVER',
        action: 'Avaliação KO',
        detail: `Regras KO executadas para ${id}.`,
        createdAt: baseTimeline[1].createdAt,
        plantId: plant.id,
        workOrderId: id
      });

      decisions.forEach((decision, decisionIndex) => {
        auditLogs.push({
          id: `${id}-A${decisionIndex + 2}`,
          actor: decision.actorRole === 'APPROVER' ? 'Controladoria' : 'Diretoria',
          role: decision.actorRole,
          action: `Decisão ${decision.action}`,
          detail: decision.reason,
          createdAt: decision.createdAt,
          plantId: plant.id,
          workOrderId: id
        });
      });
    }
  });

  return {
    companies: companies as unknown as Dataset['companies'],
    plants,
    workOrders,
    rules: baseRules,
    auditLogs
  };
}

export const dataset = generateDataset();

export function regenerateDataset(seed = 42) {
  return generateDataset(seed);
}
