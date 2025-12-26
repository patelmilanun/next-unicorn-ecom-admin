import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { products, images as imagesTable, stores } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();

    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 });
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse('Size id is required', { status: 400 });
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

    const product = await db.transaction(async (tx) => {
      const productId = crypto.randomUUID();
      const [newProduct] = await tx
        .insert(products)
        .values({
          id: productId,
          name,
          price: parseFloat(price),
          isFeatured: !!isFeatured,
          isArchived: !!isArchived,
          categoryId,
          colorId,
          sizeId,
          storeId: storeId,
        })
        .returning();

      if (images && images.length > 0) {
        await tx.insert(imagesTable).values(
          images.map((image: { url: string }) => ({
            id: crypto.randomUUID(),
            productId,
            url: image.url,
          }))
        );
      }

      return newProduct;
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const results = await db.query.products.findMany({
      where: and(
        eq(products.storeId, storeId),
        categoryId ? eq(products.categoryId, categoryId) : undefined,
        colorId ? eq(products.colorId, colorId) : undefined,
        sizeId ? eq(products.sizeId, sizeId) : undefined,
        isFeatured ? eq(products.isFeatured, true) : undefined,
        eq(products.isArchived, false)
      ),
      with: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: [desc(products.createdAt)],
    });

    return NextResponse.json(results);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
