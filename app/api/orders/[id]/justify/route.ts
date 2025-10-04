import { NextRequest, NextResponse } from 'next/server';
import { addJustification } from '@/lib/store';
import { respondWithLatency } from '@/lib/api-helpers';

interface Params {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const text = body?.text as string;
  if (!text) {
    return NextResponse.json({ error: 'Texto obrigatório' }, { status: 400 });
  }
  const justification = {
    id: `${params.id}-J-${Date.now()}`,
    authorRole: 'USER' as const,
    text,
    createdAt: new Date().toISOString()
  };
  const order = addJustification(params.id, justification);
  if (!order) {
    return NextResponse.json({ error: 'Ordem não encontrada' }, { status: 404 });
  }
  return respondWithLatency({ data: order });
}
