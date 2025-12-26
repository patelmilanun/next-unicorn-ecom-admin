import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { stores } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const store = await db
      .update(stores)
      .set({ name })
      .where(and(eq(stores.id, storeId), eq(stores.userId, userId)));

    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORE_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const store = await db
      .delete(stores)
      .where(and(eq(stores.id, storeId), eq(stores.userId, userId)));

    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
