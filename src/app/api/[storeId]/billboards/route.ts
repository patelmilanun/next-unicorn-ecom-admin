import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { billboards, stores } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();

    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!label) {
      return new NextResponse('Label is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const storeByUserId = await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const [billboard] = await db
      .insert(billboards)
      .values({
        id: crypto.randomUUID(),
        label,
        imageUrl,
        storeId: storeId,
      })
      .returning();

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARDS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const results = await db
      .select()
      .from(billboards)
      .where(eq(billboards.storeId, storeId));

    return NextResponse.json(results);
  } catch (error) {
    console.error('[BILLBOARDS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
