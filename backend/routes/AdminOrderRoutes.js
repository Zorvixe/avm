import express from "express";
import PDFDocument from "pdfkit";
import {
  bulkDeleteOrders,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderAddress,
  updateOrderStatus,
} from "../controllers/OrdersControllers.js";
import {
  checkAWBStatus,
  generateAWB,
  generateInvoice,
  generateLabel,
  proxyDownload,
  pushToShiprocket,
  authenticateShiprocket,
} from "../controllers/ShiprocketControllers.js";
import { sql } from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

const requireAdmin = [verifyToken, verifyAdmin];

router.get("/orders", requireAdmin, async (req, res) => {
  const originalJson = res.json.bind(res);
  res.json = (payload) => {
    if (payload?.success && Array.isArray(payload.data)) {
      return originalJson({ success: true, orders: payload.data });
    }
    return originalJson(payload);
  };
  return getOrders(req, res);
});

router.get("/orders/:id", requireAdmin, getOrderById);
router.put("/orders/:id/status", requireAdmin, updateOrderStatus);
router.put("/orders/:id/address", requireAdmin, updateOrderAddress);
router.delete("/orders/:id", requireAdmin, deleteOrder);
router.post("/orders/bulk-delete", requireAdmin, bulkDeleteOrders);

router.post("/orders/:id/shiprocket", requireAdmin, pushToShiprocket);
router.post("/orders/:id/awb", requireAdmin, generateAWB);
router.get("/orders/:id/awb-status", requireAdmin, checkAWBStatus);
router.post("/orders/:id/label", requireAdmin, generateLabel);
router.post("/orders/:id/invoice", requireAdmin, generateInvoice);
router.post("/orders/proxy-download", requireAdmin, proxyDownload);

router.get("/orders/:id/shiprocket-pickup", requireAdmin, async (req, res) => {
  try {
    const [order] = await sql`
      SELECT id, shiprocket_order_id, shiprocket_shipment_id,
             pickup_schedule_date, pickup_schedule_time, pickup_schedule_display
      FROM orders
      WHERE id = ${req.params.id}
    `;

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.pickup_schedule_display || order.pickup_schedule_date || order.pickup_schedule_time) {
      return res.json({
        success: true,
        schedule: {
          date: order.pickup_schedule_date,
          time: order.pickup_schedule_time,
          display: order.pickup_schedule_display || [order.pickup_schedule_date, order.pickup_schedule_time].filter(Boolean).join(" "),
        },
      });
    }

    if (!order.shiprocket_order_id && !order.shiprocket_shipment_id) {
      return res.json({ success: true, schedule: null, message: "Order is not packed in Shiprocket yet" });
    }

    const token = await authenticateShiprocket();
    const url = order.shiprocket_shipment_id
      ? `https://apiv2.shiprocket.in/v1/external/shipments/${order.shiprocket_shipment_id}`
      : `https://apiv2.shiprocket.in/v1/external/orders/show/${order.shiprocket_order_id}`;

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    const candidates = [
      data,
      data.data,
      data.data?.shipment,
      data.data?.order,
      ...(Array.isArray(data.data?.shipments) ? data.data.shipments : []),
    ].filter(Boolean);

    const found = candidates.find((item) =>
      item.pickup_date ||
      item.pickup_scheduled_date ||
      item.pickup_date_time ||
      item.schedule_date ||
      item.shipment_pickup_date ||
      item.pickup_time ||
      item.pickup_slot ||
      item.pickup_time_slot ||
      item.pickup_scheduled_time ||
      item.schedule_time ||
      item.shipment_pickup_time
    );

    if (!found) {
      return res.json({ success: true, schedule: null, message: "Pickup schedule is not available yet" });
    }

    const date = found.pickup_date || found.pickup_scheduled_date || found.pickup_date_time || found.schedule_date || found.shipment_pickup_date || null;
    const time = found.pickup_time || found.pickup_slot || found.pickup_time_slot || found.pickup_scheduled_time || found.schedule_time || found.shipment_pickup_time || null;
    const display = [date, time].filter(Boolean).join(" ");

    await sql`
      UPDATE orders
      SET pickup_schedule_date = ${date}, pickup_schedule_time = ${time}, pickup_schedule_display = ${display}
      WHERE id = ${req.params.id}
    `;

    res.json({ success: true, schedule: { date, time, display } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch Shiprocket pickup schedule" });
  }
});

router.get("/orders/:id/local-pdf", requireAdmin, async (req, res) => {
  try {
    const orderRows = await sql`SELECT * FROM orders WHERE id = ${req.params.id}`;
    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orderRows[0];
    const items = await sql`SELECT * FROM order_items WHERE order_id = ${req.params.id}`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=AVM-Invoice-${order.id}.pdf`);

    const doc = new PDFDocument({ margin: 48 });
    doc.pipe(res);

    doc.fontSize(22).text("AVM Tax Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order: #${order.id}`);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString("en-IN")}`);
    doc.text(`Customer: ${order.customer_name}`);
    doc.text(`Phone: ${order.customer_phone}`);
    doc.text(`Email: ${order.customer_email || "N/A"}`);
    doc.text(`Address: ${order.address}, ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}`);
    doc.moveDown();

    doc.fontSize(14).text("Items", { underline: true });
    doc.moveDown(0.5);
    items.forEach((item, index) => {
      doc.fontSize(11).text(`${index + 1}. ${item.product_name} (${item.package_size || "N/A"})`);
      doc.text(`   Qty: ${item.quantity} | Price: Rs ${item.price} | Subtotal: Rs ${item.subtotal}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: Rs ${order.total_amount}`, { align: "right" });
    doc.text(`Payment: ${order.payment_method} (${order.payment_status})`, { align: "right" });
    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate invoice" });
  }
});

export default router;
