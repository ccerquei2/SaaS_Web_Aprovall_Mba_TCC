import { NextRequest } from 'next/server';
import { listAuditLogs } from '@/lib/store';
import { respondWithLatency } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const logs = listAuditLogs();
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const plantId = searchParams.get('plant');
  const workOrderId = searchParams.get('workOrder');

  let result = logs;
  if (role) {
    result = result.filter((log) => log.role === role);
  }
  if (plantId) {
    result = result.filter((log) => log.plantId === plantId);
  }
  if (workOrderId) {
    result = result.filter((log) => log.workOrderId === workOrderId);
  }

  return respondWithLatency({ data: result.slice(0, 200) });
}
