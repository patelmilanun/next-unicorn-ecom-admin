import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { billboards, categories } from '@/db/schema';

import CategoryForm from './components/category-form';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string; storeId: string }>;
}) {
  const { categoryId, storeId } = await params;
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  });

  const results = await db.query.billboards.findMany({
    where: eq(billboards.storeId, storeId),
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={results} initialData={category || null} />
      </div>
    </div>
  );
}
