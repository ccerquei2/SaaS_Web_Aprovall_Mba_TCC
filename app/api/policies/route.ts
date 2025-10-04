import { NextRequest } from 'next/server';
import { listRules, updateRule } from '@/lib/store';
import { respondWithLatency } from '@/lib/api-helpers';

export async function GET() {
  const rules = listRules();
  return respondWithLatency({ data: rules });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const updated = updateRule(body);
  return respondWithLatency({ data: updated });
}
