import { notFound } from 'next/navigation';
import { getWorkOrderById } from '@/lib/store';
import { WorkOrderDetail } from '@/components/orders/detail/order-detail';

interface Params {
  params: { id: string };
}

export default function OrderDetailPage({ params }: Params) {
  const order = getWorkOrderById(params.id);
  if (!order) {
    notFound();
  }
  return <WorkOrderDetail order={order} />;
}
