import Razorpay from "razorpay";
import crypto from "crypto";
import { sql } from "../config/db.js";

// ─── Helper: load Razorpay instance with DB credentials ───────────────────────
const getRazorpayInstance = async () => {
  const rows = await sql`SELECT key, value FROM settings WHERE key IN ('razorpay_key_id','razorpay_key_secret')`;
  const cfg = {};
  for (const r of rows) cfg[r.key] = r.value;

  const keyId = cfg.razorpay_key_id || process.env.RAZORPAY_KEY_ID;
  const keySecret = cfg.razorpay_key_secret || process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured. Please update Settings.");
  }
console.log("Key ID:", keyId);
console.log("Secret exists:", !!keySecret);
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// POST /razorpay/order — create a Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = await getRazorpayInstance();
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    res.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /razorpay/verify — verify signature + create DB order
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body;

    // Get key secret for signature verification
    const rows = await sql`SELECT value FROM settings WHERE key = 'razorpay_key_secret'`;
    const keySecret = rows[0]?.value || process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return res.status(500).json({ success: false, message: "Razorpay not configured" });
    }

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Create order in DB
    const {
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
      state,
      pincode,
      house_no,
      street_area,
      landmark,
      total_amount,
      items,
    } = orderDetails;

    const [order] = await sql`
      INSERT INTO orders (
        customer_name, customer_email, customer_phone,
        address, city, state, pincode,
        house_no, street_area, landmark,
        total_amount, payment_method, payment_status, order_status,
        razorpay_order_id, razorpay_payment_id
      ) VALUES (
        ${customer_name}, ${customer_email || null}, ${customer_phone},
        ${address}, ${city}, ${state}, ${pincode},
        ${house_no || ""}, ${street_area || ""}, ${landmark || ""},
        ${total_amount}, 'Razorpay', 'Completed', 'Placed',
        ${razorpay_order_id}, ${razorpay_payment_id}
      ) RETURNING *
    `;

    // Insert order items
    if (items && items.length > 0) {
      for (const item of items) {
        await sql`
          INSERT INTO order_items (
            order_id, product_id, product_name, product_image,
            package_size, price, quantity, subtotal
          ) VALUES (
            ${order.id},
            ${item.id || item.product_id},
            ${item.title || item.product_name},
            ${item.image || item.product_image || ""},
            ${item.size || item.package_size || ""},
            ${Number(item.price)},
            ${Number(item.quantity)},
            ${Number(item.price) * Number(item.quantity)}
          )
        `;
      }
    }

    res.json({
      success: true,
      orderId: order.id,
      message: "Payment verified and order placed successfully",
    });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /razorpay/webhook — raw body webhook from Razorpay
export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.body.toString();

    if (webhookSecret && signature) {
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");
      if (expected !== signature) {
        return res.status(400).json({ success: false, message: "Invalid webhook signature" });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      await sql`
        UPDATE orders
        SET payment_status = 'Completed', updated_at = NOW()
        WHERE razorpay_order_id = ${payment.order_id}
          AND payment_status != 'Completed'
      `;
      console.log("✅ Razorpay webhook: payment captured for", payment.order_id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
