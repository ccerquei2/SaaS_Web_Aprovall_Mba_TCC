import { NextRequest } from 'next/server';
import { getApprovalFlowBreakdown, getKpis, getTrendData, getTodayAnomalies } from '@/lib/metrics';
import { respondWithLatency } from '@/lib/api-helpers';

export async function GET(_request: NextRequest) {
  const kpis = getKpis();
  const approvalBreakdown = getApprovalFlowBreakdown();
  const trend = getTrendData();
  const anomalies = getTodayAnomalies();
  return respondWithLatency({ kpis, approvalBreakdown, trend, anomalies });
}
