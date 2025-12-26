import Stripe from 'stripe';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { products as productsTable, orders, orderItems } from '@/db/schema';
import { inArray, eq } from 'drizzle-orm';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { productIds, redirectUrl, cancelUrl } = await req.json();

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product ids are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!redirectUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Redirect Url and Cancel Url are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { storeId } = await params;

    const products = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, productIds));

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'INR',
          product_data: {
            name: product.name,
          },
          unit_amount: (product.price || 0) * 100,
        },
      });
    });

    const order = await db.transaction(async (tx) => {
      const orderId = crypto.randomUUID();
      const [newOrder] = await tx
        .insert(orders)
        .values({
          id: orderId,
          storeId: storeId,
          isPaid: false,
        })
        .returning();

      await tx.insert(orderItems).values(
        productIds.map((productId: string) => ({
          id: crypto.randomUUID(),
          orderId,
          productId,
        }))
      );

      return newOrder;
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      success_url: redirectUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log('[CHECKOUT_POST]', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
