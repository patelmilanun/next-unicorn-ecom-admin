import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { colors } from '@/db/schema';

import { ColorColumn } from './components/columns';
import ColorClient from './components/client';

export default async function ColorsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const results = await db.query.colors.findMany({
    where: eq(colors.storeId, storeId),
    orderBy: desc(colors.createdAt),
  });

  const formattedColors: ColorColumn[] = results.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt!, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
}
