import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { billboards, stores } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params;

    if (!billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const billboard = await db.query.billboards.findFirst({
      where: eq(billboards.id, billboardId),
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARD_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ billboardId: string; storeId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    const { billboardId, storeId } = await params;

    if (!billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const storeByUserId = await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const billboard = await db
      .delete(billboards)
      .where(eq(billboards.id, billboardId));

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARD_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ billboardId: string; storeId: string }> }
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

    const { billboardId, storeId } = await params;

    if (!billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const storeByUserId = await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const [billboard] = await db
      .update(billboards)
      .set({ label, imageUrl })
      .where(eq(billboards.id, billboardId))
      .returning();

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARD_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
