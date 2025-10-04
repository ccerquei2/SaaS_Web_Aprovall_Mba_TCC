import { NextRequest, NextResponse } from 'next/server';
import { appendDecision } from '@/lib/store';
import { respondWithLatency } from '@/lib/api-helpers';

interface Params {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const reason = (body?.reason as string) ?? 'Aprovação registrada manualmente.';
  const decision = {
    id: `${params.id}-DEC-${Date.now()}`,
    actorRole: 'APPROVER' as const,
    action: 'APPROVE' as const,
    reason,
    createdAt: new Date().toISOString()
  };
  const order = appendDecision(params.id, decision);
  if (!order) {
    return NextResponse.json({ error: 'Ordem não encontrada' }, { status: 404 });
  }
  return respondWithLatency({ data: order });
}
