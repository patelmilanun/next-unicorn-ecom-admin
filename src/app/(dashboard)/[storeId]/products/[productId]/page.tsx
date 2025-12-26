import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { categories, colors, products, sizes } from '@/db/schema';

import ProductForm from './components/product-form';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string; storeId: string }>;
}) {
  const { productId, storeId } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      images: true,
    },
  });

  const categoriesResults = await db.query.categories.findMany({
    where: eq(categories.storeId, storeId),
  });

  const sizesResults = await db.query.sizes.findMany({
    where: eq(sizes.storeId, storeId),
  });

  const colorsResults = await db.query.colors.findMany({
    where: eq(colors.storeId, storeId),
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categoriesResults}
          colors={colorsResults}
          sizes={sizesResults}
          initialData={product || null}
        />
      </div>
    </div>
  );
}
