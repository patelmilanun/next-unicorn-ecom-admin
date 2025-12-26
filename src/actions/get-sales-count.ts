import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';

export const getSalesCount = async (storeId: string) => {
  const result = await db
    .select({ value: count() })
    .from(orders)
    .where(and(eq(orders.storeId, storeId), eq(orders.isPaid, true)));

  return result[0].value;
};
