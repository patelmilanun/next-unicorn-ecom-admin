import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { billboards } from '@/db/schema';

import { BillboardColumn } from './components/columns';
import BillboardClient from './components/client';

export default async function BillboardsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const results = await db.query.billboards.findMany({
    where: eq(billboards.storeId, storeId),
    orderBy: desc(billboards.createdAt),
  });

  const formattedBillboards: BillboardColumn[] = results.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt!, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
}
