import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { eq, and, sum, sql } from 'drizzle-orm';

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (
  storeId: string
): Promise<GraphData[]> => {
  const result = await db
    .select({
      month: sql<string>`strftime('%m', datetime(${orders.createdAt}, 'unixepoch'))`,
      revenue: sum(products.price),
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(and(eq(orders.storeId, storeId), eq(orders.isPaid, true)))
    .groupBy(sql`strftime('%m', datetime(${orders.createdAt}, 'unixepoch'))`);

  const monthlyRevenue: { [key: number]: number } = {};
  
  result.forEach((row) => {
    const monthIndex = parseInt(row.month) - 1; // strftime returns '01'-'12'
    monthlyRevenue[monthIndex] = Number(row.revenue) || 0;
  });

  const graphData: GraphData[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ];

  for (let i = 0; i < 12; i++) {
    graphData[i].total = monthlyRevenue[i] || 0;
  }

  return graphData;
};
