import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";

// All customers receive these two folders regardless of what they purchased
const DOWNLOAD_LINKS = [
  {
    name: "Photography Notes + All Extras",
    url: "https://drive.google.com/drive/u/0/folders/1E6OB0aoj6xlSCDthFCdBf4okKRGAqU0h",
  },
];

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[webhook] Signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("[webhook] Event received:", event.type);
  console.log("[webhook] RESEND_API_KEY prefix:", process.env.RESEND_API_KEY?.slice(0, 8));

  // Handle payment_intent.succeeded (custom checkout page flow)
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;

    // Email comes from receipt_email (set via confirmParams in the frontend)
    const email = pi.receipt_email || pi.metadata?.customer_email || null;
    const amountTotal = pi.amount / 100;
    const productIds = (pi.metadata?.productIds || "").split(",").filter(Boolean);

    console.log("[webhook] payment_intent.succeeded — email:", email, "| productIds:", productIds);

    await fulfillOrder({ email, amountTotal });
  }

  // Handle checkout.session.completed (Stripe hosted checkout fallback)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      null;
    const amountTotal = session.amount_total / 100;
    const productIds = (session.metadata?.productIds || "").split(",").filter(Boolean);

    console.log("[webhook] checkout.session.completed — email:", email, "| productIds:", productIds);

    await fulfillOrder({ email, amountTotal });
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder({ email, amountTotal }) {
  if (!email) {
    console.warn("[fulfillOrder] No email found — skipping");
    return;
  }

  console.log("[fulfillOrder] Sending download links to:", email);

  const downloadListHtml = DOWNLOAD_LINKS
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0e6da">
          <strong style="display:block;color:#111;font-size:15px">${item.name}</strong>
          <a href="${item.url}" style="color:#111;font-size:14px;text-decoration:none">⬇ Open Folder</a>
        </td>
      </tr>`
    )
    .join("");

  const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;color:#111">
      <div style="background:#111;padding:32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">Thank you for your order! 🎉</h1>
      </div>
      <div style="padding:32px">
        <p style="font-size:16px;color:#444">Hi there,</p>
        <p style="font-size:16px;color:#444">
          Your order of <strong>$${amountTotal.toFixed(2)}</strong> is confirmed.
          Here are your download links:
        </p>

        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          ${downloadListHtml}
        </table>

        <div style="margin-top:32px;padding:16px;background:#fff8f3;border-radius:8px;border:1px solid #f0e6da">
          <p style="margin:0;font-size:13px;color:#888">
            If you have any issues, reply to this email or contact
            <a href="mailto:photography@easyguide.store" style="color:#111">photography@easyguide.store</a>
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: "Your Photography Easy Guide — Download Links Inside! 📷",
      html: emailHtml,
    });

    if (resendError) {
      console.error("[fulfillOrder] Resend error:", JSON.stringify(resendError));
    } else {
      console.log("[fulfillOrder] Email sent via Resend. ID:", resendData?.id, "| To:", email);
    }
  } catch (err) {
    console.error("[fulfillOrder] Resend exception:", err.message);
  }
}
