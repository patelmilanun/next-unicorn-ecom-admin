import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { categories } from '@/db/schema';

import { CategoryColumn } from './components/columns';
import CategoriesClient from './components/client';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const results = await db.query.categories.findMany({
    where: eq(categories.storeId, storeId),
    with: {
      billboard: true,
    },
    orderBy: desc(categories.createdAt),
  });

  const formattedCategories: CategoryColumn[] = results.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt!, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
}
