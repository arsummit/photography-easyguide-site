import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  try {
    const { cartItems, email, processingFee = 0 } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const amount = Math.round(
      (cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + processingFee) * 100
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      setup_future_usage: "off_session",
      ...(email && { receipt_email: email }),
      metadata: {
        productIds: cartItems.map((i) => i.id).join(","),
        ...(email && { customer_email: email }),
        site: "drawing",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("PaymentIntent error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
