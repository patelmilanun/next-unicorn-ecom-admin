import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { sizes } from '@/db/schema';

import { SizeColumn } from './components/columns';
import SizesClient from './components/client';

export default async function SizesPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const results = await db.query.sizes.findMany({
    where: eq(sizes.storeId, storeId),
    orderBy: desc(sizes.createdAt),
  });

  const formattedSizes: SizeColumn[] = results.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt!, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
}
