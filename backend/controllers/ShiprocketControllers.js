import { sql } from "../config/db.js";

// ─── Shiprocket Auth Cache ────────────────────────────────────────────────────
let shiprocketToken = null;
let tokenExpiry = null;
let cachedShiprocketConfig = null;
let configLastFetched = null;

export const getShiprocketConfig = async () => {
  if (cachedShiprocketConfig && configLastFetched && (Date.now() - configLastFetched) < 60000) {
    return cachedShiprocketConfig;
  }

  try {
    const rows = await sql`
      SELECT key, value FROM settings
      WHERE key IN ('shiprocket_email', 'shiprocket_password', 'shiprocket_pickup_pincode', 'shiprocket_webhook_secret')
    `;

    const config = {
      shiprocket_email: '',
      shiprocket_password: '',
      shiprocket_pickup_pincode: '500001',
      shiprocket_webhook_secret: ''
    };

    for (const row of rows) {
      config[row.key] = row.value || '';
    }

    cachedShiprocketConfig = config;
    configLastFetched = Date.now();
    return config;
  } catch (error) {
    console.error("Failed to fetch Shiprocket config:", error);
    return {
      shiprocket_email: '',
      shiprocket_password: '',
      shiprocket_pickup_pincode: '500001',
      shiprocket_webhook_secret: ''
    };
  }
};

export const clearShiprocketCache = () => {
  cachedShiprocketConfig = null;
  configLastFetched = null;
  shiprocketToken = null;
  tokenExpiry = null;
  console.log("Shiprocket cache cleared");
};

export const authenticateShiprocket = async () => {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const config = await getShiprocketConfig();
  const email = config.shiprocket_email;
  const password = config.shiprocket_password;

  if (!email || !password || password === '********') {
    throw new Error("Shiprocket credentials not configured. Please add them in Settings page.");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid response from Shiprocket: ${responseText.substring(0, 100)}`);
    }

    if (response.status === 200 && data.token) {
      shiprocketToken = data.token;
      tokenExpiry = Date.now() + (8 * 24 * 60 * 60 * 1000);
      return shiprocketToken;
    } else {
      let errorMessage = "Shiprocket authentication failed";
      if (data.message) {
        if (data.message.toLowerCase().includes("invalid") || data.message.toLowerCase().includes("wrong")) {
          errorMessage = "Invalid Shiprocket credentials. Please check your email and password in Settings.";
        } else {
          errorMessage = data.message;
        }
      }
      if (response.status === 401) errorMessage = "Authentication failed (401). Invalid Shiprocket credentials.";
      if (response.status === 403) errorMessage = "Access denied (403). Please ensure your Shiprocket account has API access enabled.";
      throw new Error(errorMessage);
    }
  } catch (err) {
    if (err.name === 'AbortError') throw new Error("Shiprocket connection timeout.");
    if (err.message.includes("fetch") || err.message.includes("network")) {
      throw new Error("Network error connecting to Shiprocket.");
    }
    throw err;
  }
};

// ─── Address Extraction ───────────────────────────────────────────────────────
const extractAddressComponents = (order) => {
  let fullAddress = order.address || '';
  let houseNo = order.house_no || '';
  let streetArea = order.street_area || '';
  let landmark = order.landmark || '';
  let city = order.city || '';
  let state = order.state || '';
  let pincode = order.pincode || '';
  let country = order.country || 'India';

  if ((!fullAddress || fullAddress === '') && (houseNo || streetArea)) {
    const parts = [];
    if (houseNo) parts.push(houseNo);
    if (streetArea) parts.push(streetArea);
    if (landmark) parts.push(landmark);
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (pincode) parts.push(pincode);
    fullAddress = parts.join(', ');
  }

  if (!pincode && fullAddress) {
    const pinMatch = fullAddress.match(/\b\d{6}\b/);
    if (pinMatch) pincode = pinMatch[0];
  }

  if (!city || city === '' || city === 'NA') city = "Unknown City";
  if (!state || state === '' || state === 'NA') state = "Unknown State";
  if (!pincode || !/^\d{6}$/.test(pincode)) pincode = "500001";

  fullAddress = fullAddress.replace(/undefined/g, '').replace(/null/g, '').replace(/,\s*,/g, ',').replace(/,\s+$/g, '').trim();
  if (!fullAddress) fullAddress = "Address not specified";
  fullAddress = fullAddress.substring(0, 200);

  return { fullAddress, houseNo, streetArea, landmark, city, state, pincode, country };
};

// ─── Push Order to Shiprocket ─────────────────────────────────────────────────
export const pushToShiprocket = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { pickup_location_id } = req.body;

    const orderRows = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
    if (orderRows.length === 0) return res.status(404).json({ success: false, message: "Order not found" });
    const order = orderRows[0];

    if (order.shiprocket_order_id) {
      return res.status(400).json({ success: false, message: "Order already pushed to Shiprocket" });
    }

    const addressComponents = extractAddressComponents(order);

    const missingFields = [];
    if (addressComponents.city === 'Unknown City') missingFields.push('City');
    if (addressComponents.state === 'Unknown State') missingFields.push('State');
    if (addressComponents.pincode === '500001') missingFields.push('Pincode');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing delivery address: ${missingFields.join(', ')}. Please update order address first.`,
        missingFields
      });
    }

    if (!pickup_location_id) {
      return res.status(400).json({ success: false, message: "Please select a pickup location for this order", action: "select_pickup" });
    }

    let token;
    try {
      token = await authenticateShiprocket();
    } catch (authError) {
      return res.status(401).json({ success: false, message: "Shiprocket authentication failed.", error: authError.message });
    }

    // Fetch pickup locations
    const pickupListResponse = await fetch("https://apiv2.shiprocket.in/v1/external/settings/company/pickup", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    });
    const pickupListData = await pickupListResponse.json();
    let pickupLocations = [];

    if (pickupListData.data?.shipping_address) pickupLocations = pickupListData.data.shipping_address;
    else if (pickupListData.data?.pickup_locations) pickupLocations = pickupListData.data.pickup_locations;
    else if (pickupListData.pickup_locations) pickupLocations = pickupListData.pickup_locations;

    const foundLocation = pickupLocations.find(loc =>
      String(loc.pickup_location_id || loc.id) === String(pickup_location_id)
    );

    if (!foundLocation) {
      return res.status(400).json({ success: false, message: `Pickup location (ID: ${pickup_location_id}) not found.` });
    }

    const selectedPickupLocation = {
      id: foundLocation.pickup_location_id || foundLocation.id,
      name: foundLocation.pickup_location || foundLocation.name,
      address: foundLocation.address,
      address_2: foundLocation.address_2,
      city: foundLocation.city,
      state: foundLocation.state,
      pincode: foundLocation.pin_code || foundLocation.pincode
    };

    // Save pickup info on order
    await sql`
      UPDATE orders SET
        pickup_location_name = ${selectedPickupLocation.name},
        pickup_address_line1 = ${selectedPickupLocation.address || ''},
        pickup_address_line2 = ${selectedPickupLocation.address_2 || ''},
        pickup_city = ${selectedPickupLocation.city || ''},
        pickup_state = ${selectedPickupLocation.state || ''},
        pickup_pincode = ${selectedPickupLocation.pincode || ''},
        updated_at = NOW()
      WHERE id = ${orderId}
    `;

    // Get order items
    const orderItems = await sql`
      SELECT oi.*, p.name as product_name, p.product_code
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
    `;

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No items found in order" });
    }

    const srItems = orderItems.map(item => ({
      name: (item.product_name || item.product_name).substring(0, 100),
      sku: item.product_code || `SKU-${item.product_id}`,
      units: parseInt(item.quantity),
      selling_price: parseFloat(item.price),
      discount: "",
      tax: ""
    }));

    const pkgWeight = orderItems.reduce((sum, item) => sum + (0.5 * parseInt(item.quantity)), 0.5);
    const isPrepaid = order.payment_method === 'Prepaid' || order.payment_method === 'RAZORPAY' || order.payment_method === 'Razorpay' || order.payment_method === 'Online';

    let billingAddress = addressComponents.fullAddress;
    if (!billingAddress || billingAddress === 'Address not specified') {
      billingAddress = `${addressComponents.houseNo ? addressComponents.houseNo + ', ' : ''}${addressComponents.streetArea || ''}`;
    }
    billingAddress = (billingAddress || "Address not specified").substring(0, 200);

    const payload = {
      order_id: `AVM-${order.id}`,
      order_date: new Date(order.created_at).toISOString().split('T')[0] + " 10:00",
      pickup_location: selectedPickupLocation.name,
      billing_customer_name: (order.customer_name || "Customer").substring(0, 100),
      billing_last_name: "",
      billing_address: billingAddress,
      billing_address_2: (addressComponents.landmark || "").substring(0, 100),
      billing_city: addressComponents.city,
      billing_pincode: addressComponents.pincode,
      billing_state: addressComponents.state,
      billing_country: addressComponents.country,
      billing_email: (order.customer_email || "customer@example.com").substring(0, 100),
      billing_phone: (order.customer_phone || "9999999999").substring(0, 20),
      shipping_is_billing: true,
      order_items: srItems,
      payment_method: isPrepaid ? 'Prepaid' : 'COD',
      sub_total: parseFloat(order.total_amount),
      length: 10,
      breadth: 10,
      height: 5,
      weight: Math.max(pkgWeight, 0.5)
    };

    let fetchRes, result;
    try {
      fetchRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const responseText = await fetchRes.text();
      try { result = JSON.parse(responseText); } catch (e) {
        return res.status(502).json({ success: false, message: "Shiprocket API returned invalid JSON.", raw_response: responseText.substring(0, 200) });
      }
    } catch (fetchError) {
      return res.status(502).json({ success: false, message: "Network error connecting to Shiprocket.", error: fetchError.message });
    }

    if (fetchRes.ok && (result.order_id || result.shipment_id)) {
      const srOrderId = result.order_id ? result.order_id.toString() : null;
      const srShipmentId = result.shipment_id ? result.shipment_id.toString() : null;

      await sql`
        UPDATE orders SET shiprocket_order_id = ${srOrderId}, shiprocket_shipment_id = ${srShipmentId}, updated_at = NOW()
        WHERE id = ${orderId}
      `;

      // Auto-generate AWB
      let awbCode = null;
      if (srShipmentId) {
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          const awbRes = await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ shipment_id: parseInt(srShipmentId) })
          });
          const awbData = await awbRes.json();
          awbCode = awbData.awb_code || awbData.data?.awb_code || awbData.data?.awb || null;

          if (!awbCode) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const shipmentRes = await fetch(`https://apiv2.shiprocket.in/v1/external/shipments/${srShipmentId}`, {
              method: "GET",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            });
            const shipmentData = await shipmentRes.json();
            awbCode = shipmentData.data?.awb_code || shipmentData.data?.awb || shipmentData.awb_code || null;
          }

          if (awbCode) {
            await sql`UPDATE orders SET awb_code = ${awbCode} WHERE id = ${orderId}`;
          }
        } catch (awbErr) {
          console.error("Auto AWB assignment error:", awbErr.message);
        }
      }

      return res.json({
        success: true,
        message: awbCode ? "Order pushed to Shiprocket with AWB! 🚀" : "Order pushed to Shiprocket! AWB will be generated automatically.",
        pickup_location_used: selectedPickupLocation.name,
        shiprocket_order_id: srOrderId,
        shiprocket_shipment_id: srShipmentId,
        awb_code: awbCode,
        data: result
      });
    } else {
      let errorMessage = result?.message || "Failed to push to Shiprocket";
      if (result?.errors) {
        if (typeof result.errors === 'object' && !Array.isArray(result.errors)) {
          errorMessage = Object.values(result.errors).flat().join(", ");
        } else if (Array.isArray(result.errors)) {
          errorMessage = result.errors.join(", ");
        }
      }
      return res.status(400).json({ success: false, message: errorMessage, errors: result?.errors });
    }
  } catch (error) {
    console.error("Shiprocket push error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error pushing order" });
  }
};

// ─── Fetch Pickup Locations ───────────────────────────────────────────────────
export const getPickupLocations = async (req, res) => {
  try {
    const token = await authenticateShiprocket();

    const response = await fetch("https://apiv2.shiprocket.in/v1/external/settings/company/pickup", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    });

    const responseText = await response.text();
    let data;
    try { data = JSON.parse(responseText); } catch (e) {
      return res.status(502).json({ success: false, message: "Invalid response from Shiprocket API" });
    }

    let pickupLocations = [];
    if (data.data?.shipping_address) pickupLocations = data.data.shipping_address;
    else if (data.data?.pickup_locations) pickupLocations = data.data.pickup_locations;
    else if (data.pickup_locations) pickupLocations = data.pickup_locations;
    else if (data.data && Array.isArray(data.data)) pickupLocations = data.data;

    const formattedLocations = pickupLocations.map(location => ({
      id: location.pickup_location_id || location.id,
      name: location.pickup_location || location.name || "Unnamed Location",
      address: location.address || "",
      address_2: location.address_2 || "",
      city: location.city || "",
      state: location.state || "",
      pincode: location.pin_code || location.pincode || "",
      country: location.country || "India",
      phone: location.phone || "",
      email: location.email || "",
      is_default: location.is_default || false
    }));

    res.json({ success: true, pickup_locations: formattedLocations, count: formattedLocations.length });
  } catch (error) {
    console.error("Fetch pickup locations error:", error);
    res.status(500).json({ success: false, message: error.message, pickup_locations: [] });
  }
};

export const shiprocketTrackingWebhook = async (req, res) => {
  try {
    const payload = req.body || {};
    const { shipment_id, order_id, status, awb_code } = payload;
    const rawStatus = String(status || payload.current_status || payload.shipment_status || "").toLowerCase();

    let orderStatus = null;
    if (rawStatus.includes("delivered")) orderStatus = "Delivered";
    else if (rawStatus.includes("out for delivery")) orderStatus = "Out for Delivery";
    else if (rawStatus.includes("shipped") || rawStatus.includes("in transit") || rawStatus.includes("picked")) orderStatus = "Shipped";
    else if (rawStatus.includes("pickup") || rawStatus.includes("manifest") || rawStatus.includes("processing")) orderStatus = "Processing";
    else if (rawStatus.includes("cancel")) orderStatus = "Cancelled";
    else if (rawStatus.includes("return") || rawStatus.includes("rto")) orderStatus = "Returned";

    if (!shipment_id && !order_id) {
      return res.status(400).json({ success: false, message: "Missing Shiprocket order or shipment id" });
    }

    const updates = [];

    if (orderStatus && shipment_id) {
      const rows = await sql`
        UPDATE orders
        SET order_status = ${orderStatus}, updated_at = NOW()
        WHERE shiprocket_shipment_id = ${String(shipment_id)}
        RETURNING id
      `;
      updates.push(...rows);
    } else if (orderStatus && order_id) {
      const rows = await sql`
        UPDATE orders
        SET order_status = ${orderStatus}, updated_at = NOW()
        WHERE shiprocket_order_id = ${String(order_id)}
        RETURNING id
      `;
      updates.push(...rows);
    }

    if (awb_code && shipment_id) {
      await sql`
        UPDATE orders
        SET awb_code = ${String(awb_code)}, updated_at = NOW()
        WHERE shiprocket_shipment_id = ${String(shipment_id)}
      `;
    }

    const io = req.app.get("io");
    if (io && updates.length > 0) {
      updates.forEach((order) => io.emit("order_status_updated", { order_id: order.id, status: orderStatus, awb_code }));
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Shiprocket webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Generate AWB ─────────────────────────────────────────────────────────────
export const generateAWB = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderRows = await sql`SELECT shiprocket_shipment_id, awb_code, shiprocket_order_id FROM orders WHERE id = ${orderId}`;
    if (orderRows.length === 0) return res.status(404).json({ success: false, message: "Order not found" });

    const order = orderRows[0];
    if (!order.shiprocket_shipment_id) {
      return res.status(400).json({ success: false, message: "Order not pushed to Shiprocket yet." });
    }
    if (order.awb_code) {
      return res.status(400).json({ success: false, message: "AWB already generated", awb_code: order.awb_code });
    }

    const token = await authenticateShiprocket();
    const shipmentId = parseInt(order.shiprocket_shipment_id);

    const assignResponse = await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ shipment_id: shipmentId })
    });

    const assignResult = await assignResponse.json();
    let awbCode = null;

    if (assignResult.awb_assign_status === 1 || assignResult.awb_assign_status === true) {
      awbCode = assignResult.awb_code || assignResult.data?.awb_code;
    } else if (assignResult.data) {
      awbCode = assignResult.data.awb_code || assignResult.data.awb;
    }

    if (!awbCode) {
      const shipmentResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/shipments/${shipmentId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const shipmentData = await shipmentResponse.json();
      if (shipmentData.data) awbCode = shipmentData.data.awb_code || shipmentData.data.awb;
      if (!awbCode) awbCode = shipmentData.awb_code || shipmentData.awb || null;
    }

    if (!awbCode && order.shiprocket_order_id) {
      const orderResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/orders/show/${order.shiprocket_order_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const orderData = await orderResponse.json();
      if (orderData.data?.shipments?.length > 0) {
        awbCode = orderData.data.shipments[0].awb_code || orderData.data.shipments[0].awb;
      }
    }

    if (awbCode) {
      await sql`UPDATE orders SET awb_code = ${awbCode}, updated_at = NOW() WHERE id = ${orderId}`;
      return res.json({ success: true, message: "AWB generated successfully!", awb_code: awbCode });
    } else {
      let errorMessage = assignResult.message || "Could not find AWB for this order.";
      return res.status(400).json({ success: false, message: `Shiprocket Sync: ${errorMessage}`, details: assignResult });
    }
  } catch (error) {
    console.error("AWB generation error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error generating AWB" });
  }
};

// ─── Check AWB Status ─────────────────────────────────────────────────────────
export const checkAWBStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderRows = await sql`SELECT shiprocket_shipment_id, awb_code FROM orders WHERE id = ${orderId}`;
    if (orderRows.length === 0) return res.status(404).json({ success: false, message: "Order not found" });

    const order = orderRows[0];
    if (order.awb_code) return res.json({ success: true, has_awb: true, awb_code: order.awb_code });
    if (!order.shiprocket_shipment_id) return res.json({ success: true, has_awb: false, message: "Order not pushed to Shiprocket yet" });

    const token = await authenticateShiprocket();
    const shipmentResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/shipments/${order.shiprocket_shipment_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    });
    const shipmentData = await shipmentResponse.json();
    let awbCode = shipmentData.data?.awb_code || shipmentData.data?.awb || null;

    if (awbCode) {
      await sql`UPDATE orders SET awb_code = ${awbCode} WHERE id = ${orderId}`;
      return res.json({ success: true, has_awb: true, awb_code: awbCode });
    }

    res.json({ success: true, has_awb: false, message: "AWB not yet assigned.", shipment_status: shipmentData.data?.status || "Unknown" });
  } catch (error) {
    console.error("AWB status check error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Generate Label ───────────────────────────────────────────────────────────
export const generateLabel = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderRows = await sql`SELECT shiprocket_shipment_id, awb_code FROM orders WHERE id = ${orderId}`;
    const shipmentId = orderRows[0]?.shiprocket_shipment_id;
    if (!shipmentId) return res.status(400).json({ success: false, message: "Order not pushed to Shiprocket yet." });

    const token = await authenticateShiprocket();
    const shipmentIdValue = parseInt(shipmentId, 10);

    const labelRes = await fetch("https://apiv2.shiprocket.in/v1/external/courier/generate/label", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ shipment_id: [shipmentIdValue] })
    });
    const labelResult = await labelRes.json();
    const labelUrl = labelResult.label_url || labelResult.data?.label_url;

    if (labelUrl) return res.json({ success: true, label_url: labelUrl, result: labelResult });

    // If label not ready, try assigning AWB first then retry
    if (labelResult?.not_created) {
      const assignRes = await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ shipment_id: shipmentIdValue })
      });
      await assignRes.json();

      // Retry label
      const retryRes = await fetch("https://apiv2.shiprocket.in/v1/external/courier/generate/label", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ shipment_id: [shipmentIdValue] })
      });
      const retryResult = await retryRes.json();
      const retryUrl = retryResult.label_url || retryResult.data?.label_url;
      if (retryUrl) return res.json({ success: true, label_url: retryUrl, result: retryResult });
    }

    res.status(400).json({ success: false, message: labelResult.message || "Label not available yet.", details: labelResult });
  } catch (error) {
    console.error("Label generation error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error fetching label" });
  }
};

// ─── Generate Invoice ─────────────────────────────────────────────────────────
export const generateInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderRows = await sql`SELECT shiprocket_order_id FROM orders WHERE id = ${orderId}`;
    const srOrderId = orderRows[0]?.shiprocket_order_id;
    if (!srOrderId) return res.status(400).json({ success: false, message: "No Shiprocket Order ID found" });

    const token = await authenticateShiprocket();
    const fetchRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/print/invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ ids: [srOrderId] })
    });
    const result = await fetchRes.json();
    if (result.is_invoice_created) return res.json({ success: true, invoice_url: result.invoice_url });
    else return res.status(400).json({ success: false, message: "Failed to fetch invoice" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching invoice" });
  }
};

// ─── Proxy Download (for Shiprocket PDFs) ─────────────────────────────────────
export const proxyDownload = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "URL is required" });

    const fileRes = await fetch(url);
    if (!fileRes.ok) throw new Error("Unable to fetch external document");

    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error) {
    console.error("Proxy download error:", error.message);
    res.status(500).json({ success: false, message: "Failed to retrieve file." });
  }
};

// ─── Debug / Test Connection ──────────────────────────────────────────────────
export const debugShiprocket = async (req, res) => {
  try {
    const results = { timestamp: new Date().toISOString(), credentials_check: {}, authentication: {}, pickup_locations: {} };
    const config = await getShiprocketConfig();
    results.credentials_check = {
      has_email: !!config.shiprocket_email,
      email_value: config.shiprocket_email ? config.shiprocket_email.substring(0, 3) + '***' : null,
      has_password: !!config.shiprocket_password && config.shiprocket_password !== '********',
      pickup_pincode: config.shiprocket_pickup_pincode
    };

    if (!results.credentials_check.has_email || !results.credentials_check.has_password) {
      return res.json({ success: false, message: "Shiprocket credentials not configured", debug_info: results });
    }

    try {
      const token = await authenticateShiprocket();
      results.authentication = { success: true, message: "Authentication successful" };

      const pickupResponse = await fetch("https://apiv2.shiprocket.in/v1/external/settings/company/pickup", {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      const pickupData = await pickupResponse.json();
      let count = 0;
      if (pickupData.data?.shipping_address) count = pickupData.data.shipping_address.length;
      else if (pickupData.data?.pickup_locations) count = pickupData.data.pickup_locations.length;

      results.pickup_locations = { count, status: pickupResponse.status };

      res.json({ success: true, debug_info: results, message: count > 0 ? `Connected! Found ${count} pickup location(s).` : "Connected but no pickup locations found." });
    } catch (authError) {
      results.authentication = { success: false, message: authError.message };
      res.json({ success: false, message: "Authentication failed.", debug_info: results });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
