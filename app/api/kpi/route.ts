import { NextRequest } from 'next/server';
import { getKpis, getSegmentMix, getTrendData, getTodayAnomalies } from '@/lib/metrics';
import { respondWithLatency } from '@/lib/api-helpers';

export async function GET(_request: NextRequest) {
  const kpis = getKpis();
  const segmentMix = getSegmentMix();
  const trend = getTrendData();
  const anomalies = getTodayAnomalies();
  return respondWithLatency({ kpis, segmentMix, trend, anomalies });
}
