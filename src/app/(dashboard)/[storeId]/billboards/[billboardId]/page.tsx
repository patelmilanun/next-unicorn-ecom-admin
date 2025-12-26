import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { billboards } from '@/db/schema';

import BillboardForm from './components/billboard-form';

export default async function BillboardPage({
  params,
}: {
  params: Promise<{ billboardId: string }>;
}) {
  const { billboardId } = await params;
  const billboard = await db.query.billboards.findFirst({
    where: eq(billboards.id, billboardId),
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard || null} />
      </div>
    </div>
  );
}
