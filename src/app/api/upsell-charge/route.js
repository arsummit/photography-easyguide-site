import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";

const DOWNLOAD_LINKS = [
  {
    name: "Full Drawing Guide (Upgraded to Colored)",
    url: "https://drive.google.com/drive/u/0/folders/1JFhdBQICTAqXuFeleeIzO0tSM5S4gJYP",
  },
  {
    name: "All Extras and Upgrades",
    url: "https://drive.google.com/drive/u/0/folders/11jWbAB3muUxh0zNo0ucPet_xrt23F8TB",
  },
];

export async function POST(req) {
  try {
    const { originalPaymentIntentId, amountCents } = await req.json();

    // 1. Retrieve original PI to get payment method + email
    const original = await stripe.paymentIntents.retrieve(originalPaymentIntentId);
    const paymentMethodId = original.payment_method;
    const email = original.receipt_email || null;

    if (!paymentMethodId) {
      return NextResponse.json({ error: "No saved payment method found" }, { status: 400 });
    }

    // 2. Get or create a customer so we can charge off-session
    let customerId = original.customer;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: email || undefined });
      customerId = customer.id;
    }

    // 3. Attach payment method to customer (ignore if already attached)
    try {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    } catch (e) {
      // Already attached — fine
    }

    // 4. Create and confirm a new PaymentIntent off-session
    const pi = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      receipt_email: email || undefined,
      metadata: { type: "upsell" },
    });

    // 5. Send confirmation email
    if (email && pi.status === "succeeded") {
      const downloadListHtml = DOWNLOAD_LINKS.map(
        (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0e6da">
            <strong style="display:block;color:#111;font-size:15px">${item.name}</strong>
            <a href="${item.url}" style="color:#eda3ac;font-size:14px;text-decoration:none">⬇ Open Folder</a>
          </td>
        </tr>`
      ).join("");

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: "Your Drawing Upgrade — Download Links Inside! ✏️",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;color:#111">
            <div style="background:#eda3ac;padding:32px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:24px">Upgrade Confirmed! 🎉</h1>
            </div>
            <div style="padding:32px">
              <p style="font-size:16px;color:#444">Hi there,</p>
              <p style="font-size:16px;color:#444">
                Your upgrade of <strong>$${(amountCents / 100).toFixed(2)}</strong> is confirmed.
                Here are your download links:
              </p>
              <table style="width:100%;border-collapse:collapse;margin-top:16px">${downloadListHtml}</table>
              <div style="margin-top:32px;padding:16px;background:#fff8f3;border-radius:8px;border:1px solid #f0e6da">
                <p style="margin:0;font-size:13px;color:#888">
                  Issues? Contact <a href="mailto:drawing@easyguide.store" style="color:#eda3ac">drawing@easyguide.store</a>
                </p>
              </div>
            </div>
          </div>`,
      });
    }

    return NextResponse.json({ success: true, status: pi.status, paymentIntentId: pi.id });
  } catch (err) {
    console.error("[upsell-charge] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
