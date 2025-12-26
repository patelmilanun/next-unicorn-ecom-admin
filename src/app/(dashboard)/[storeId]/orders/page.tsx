import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { formatter } from '@/lib/utils';

import { OrderColumn } from './components/columns';
import OrderClient from './components/client';

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const results = await db.query.orders.findMany({
    where: eq(orders.storeId, storeId),
    with: {
      orderItems: {
        with: {
          product: true,
        },
      },
    },
    orderBy: desc(orders.createdAt),
  });

  const formattedOrders: OrderColumn[] = results.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(', '),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt!, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
}
