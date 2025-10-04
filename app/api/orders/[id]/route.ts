import { NextRequest, NextResponse } from 'next/server';
import { getWorkOrderById } from '@/lib/store';
import { respondWithLatency } from '@/lib/api-helpers';

interface Params {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: Params) {
  const order = getWorkOrderById(params.id);
  if (!order) {
    return NextResponse.json({ error: 'Ordem não encontrada' }, { status: 404 });
  }
  return respondWithLatency({ data: order });
}
