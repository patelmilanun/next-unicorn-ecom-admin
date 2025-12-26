import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { eq, and, sum } from 'drizzle-orm';

export const getTotalRevenue = async (storeId: string) => {
  const result = await db
    .select({
      totalRevenue: sum(products.price),
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(and(eq(orders.storeId, storeId), eq(orders.isPaid, true)));

  return Number(result[0]?.totalRevenue) || 0;
};
