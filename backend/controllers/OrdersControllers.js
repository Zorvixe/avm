import {sql} from "../config/db.js"


export const createOrder = async (req, res) => {
  try {

    const {
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
      state,
      pincode,
      payment_method,
      house_no,
      street_area,
      landmark,
      discount = 0,
      coupon_id = null,
      total_amount: requested_total_amount,
      items,
    } = req.body;

    if (!items || items.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Order must contain at least one item",
  });
}

 const items_total = items.reduce(
  (sum, item) => sum + Number(item.price) * Number(item.quantity),
  0
);
 const total_amount = Number(requested_total_amount) > 0
   ? Number(requested_total_amount)
   : items_total;
    
 
  const [order] = await sql`
INSERT INTO orders (

customer_name,
customer_email,
customer_phone,
address,
city,
state,
pincode,
total_amount,
payment_method,
payment_status,
order_status,
house_no,
street_area,
landmark,
discount,
coupon_id

)

VALUES (

${customer_name},
${customer_email},
${customer_phone},
${address},
${city},
${state},
${pincode},
${total_amount},
${payment_method || "Cash on Delivery"},
${payment_method === "Razorpay" ? "Completed" : "Pending"},
${"Placed"},
${house_no || ""},
${street_area || ""},
${landmark || ""},
${Number(discount) || 0},
${coupon_id}

)

RETURNING *;
`;
   for (const item of items) {

  await sql`

  INSERT INTO order_items (

    order_id,
    product_id,
    product_name,
    product_image,
    package_size,
    price,
    quantity,
    subtotal

  )

  VALUES (

    ${order.id},
    ${item.id},
    ${item.title},
    ${item.image},
    ${item.size},
    ${Number(item.price)},
${Number(item.quantity)},
${Number(item.price) * Number(item.quantity)}

  )

  `;

}
    

    const io = req.app.get("io");
    if (io) {
      io.emit("new_order", { orderId: order.id, order });
    }

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      data: order,
      orderId: order.id,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const [order] = await sql`
      UPDATE orders
      SET order_status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("order_status_updated", { order_id: order.id, status: order.order_status });
    }

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      house_no = "",
      street_area = "",
      landmark = "",
      city = "",
      state = "",
      pincode = "",
      address = "",
    } = req.body;

    if (!city || !state || !/^\d{6}$/.test(String(pincode))) {
      return res.status(400).json({
        success: false,
        message: "City, state and a valid 6-digit pincode are required",
      });
    }

    const fullAddress = address || [house_no, street_area, landmark, city, state, pincode]
      .filter(Boolean)
      .join(", ");

    const [order] = await sql`
      UPDATE orders
      SET
        house_no = ${house_no},
        street_area = ${street_area},
        landmark = ${landmark},
        city = ${city},
        state = ${state},
        pincode = ${pincode},
        address = ${fullAddress},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order address updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {

    const orders = await sql`

      SELECT
        o.id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.total_amount,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.created_at,

        COUNT(oi.id) AS total_products,
        COALESCE(SUM(oi.quantity),0) AS total_quantity

      FROM orders o

      LEFT JOIN order_items oi
      ON o.id = oi.order_id

      GROUP BY
        o.id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.total_amount,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.created_at

      ORDER BY o.created_at DESC

    `;

    res.json({
      success: true,
      data: orders,
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await sql`

      SELECT
        *
      FROM orders
      WHERE id = ${id}

    `;

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const items = await sql`
      SELECT
          product_name,
          product_image,
          package_size,
          price,
          quantity,
          subtotal
      FROM order_items
      WHERE order_id=${id}
      `;

    res.json({
      success: true,
      order: order[0],
      items,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { phone } = req.params;

    const orders = await sql`
      SELECT
        o.id,
        o.created_at,
        o.total_amount,
        o.order_status,
        o.payment_status,
        o.payment_method,
        o.awb_code,
        o.shiprocket_order_id,
        o.shiprocket_shipment_id,

        oi.product_id,
        oi.product_name,
        oi.product_image,
        oi.package_size,
        oi.price,
        oi.quantity

      FROM orders o

      JOIN order_items oi
      ON o.id = oi.order_id

      WHERE o.customer_phone = ${phone}

      ORDER BY o.created_at DESC
    `;

    res.json({
      success: true,
      data: orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await sql`
      DELETE FROM orders
      WHERE id = ${id}
    `;

    res.json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};

export const bulkDeleteOrders = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order IDs are required",
      });
    }

    const numericIds = ids.map((id) => Number(id)).filter(Boolean);

    if (numericIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid order IDs are required",
      });
    }

    const deleted = await sql`
      DELETE FROM orders
      WHERE id = ANY(${numericIds})
      RETURNING id
    `;

    res.json({
      success: true,
      message: `${deleted.length} order(s) deleted successfully`,
      deleted,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Bulk delete failed",
    });
  }
};
