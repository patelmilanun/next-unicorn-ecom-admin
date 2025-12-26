import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';

export const getStockCount = async (storeId: string) => {
  const result = await db
    .select({ value: count() })
    .from(products)
    .where(and(eq(products.storeId, storeId), eq(products.isArchived, false)));

  return result[0].value;
};
