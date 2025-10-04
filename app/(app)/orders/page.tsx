import { OrdersTable } from '@/components/orders/orders-table';
import Link from 'next/link';

export default function OrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Fila de ordens de serviço</h1>
          <p className="text-sm text-slate-600">
            Dados sintéticos com 24 plantas e mais de 600 ordens. Ajuste os filtros para montar cenas de captura.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/print/order-story" className="inline-flex items-center rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand">
            Print história
          </Link>
          <Link href="/print/value-prop" className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
            Print valor
          </Link>
        </div>
      </div>
      <OrdersTable initialStatus={searchParams.status} />
    </div>
  );
}
