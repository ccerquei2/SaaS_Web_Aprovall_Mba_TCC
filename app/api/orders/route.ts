import { NextRequest } from 'next/server';
import { getDataset } from '@/lib/store';
import { respondWithLatency } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const { workOrders } = getDataset();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const segment = searchParams.get('segment');
  const plant = searchParams.get('plant');
  const risk = searchParams.get('risk');
  const variance = searchParams.get('variance');

  let result = workOrders;
  if (status) {
    result = result.filter((order) => order.status === status);
  }
  if (segment) {
    result = result.filter((order) => order.segment === segment);
  }
  if (plant) {
    result = result.filter((order) => order.plantId === plant);
  }
  if (risk) {
    const value = Number(risk);
    result = result.filter((order) => order.riskScore >= value);
  }
  if (variance) {
    const [min, max] = variance.split(',').map(Number);
    result = result.filter((order) => {
      const abs = Math.abs(order.variancePct);
      return abs >= (min ?? 0) && abs <= (max ?? 100);
    });
  }

  return respondWithLatency({ data: result.slice(0, 200) });
}
