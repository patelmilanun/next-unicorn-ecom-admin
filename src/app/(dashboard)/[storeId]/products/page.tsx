import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { formatter } from '@/lib/utils';

import ProductsClient from './components/client';
import { ProductColumn } from './components/columns';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const results = await db.query.products.findMany({
    where: eq(products.storeId, storeId),
    with: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: desc(products.createdAt),
  });

  const formattedProducts: ProductColumn[] = results.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt!, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
}
