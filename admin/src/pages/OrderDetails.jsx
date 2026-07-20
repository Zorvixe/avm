import { useEffect, useState } from "react";
import { ArrowLeft, Edit3, FileText, PackageCheck, ReceiptText, RefreshCw, Save, Truck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetails.css";

const API_URL = "http://localhost:5000";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [addressForm, setAddressForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchOrder = async () => {
    const response = await fetch(`${API_URL}/orders/get/${id}`);
    const data = await response.json();

    if (data.success) {
      setOrder(data.order);
      setItems(data.items || []);
      setAddressForm({
        house_no: data.order.house_no || "",
        street_area: data.order.street_area || "",
        landmark: data.order.landmark || "",
        address: data.order.address || "",
        city: data.order.city || "",
        state: data.order.state || "",
        pincode: data.order.pincode || "",
      });
    }
  };

  const fetchPickupLocations = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/shiprocket/pickup-locations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const locations = data.pickup_locations || data.locations || data.data || [];
      setPickupLocations(Array.isArray(locations) ? locations : []);
      if (Array.isArray(locations) && locations.length > 0) {
        setSelectedPickup(String(locations[0].id || locations[0].pickup_location_id || ""));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([fetchOrder(), fetchPickupLocations()]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const runAction = async (label, request, successText) => {
    try {
      setBusy(label);
      setMessage("");
      const response = await request();
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Action failed");
      }

      if (data.label_url) window.open(data.label_url, "_blank");
      if (data.invoice_url) window.open(data.invoice_url, "_blank");

      setMessage(successText || data.message || "Updated successfully");
      await fetchOrder();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy("");
    }
  };

  const updateStatus = (status) => {
    runAction(
      "status",
      () => fetch(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ status }),
      }),
      "Order status updated"
    );
  };

  const saveAddress = () => {
    runAction(
      "address",
      () => fetch(`${API_URL}/orders/${id}/address`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(addressForm),
      }),
      "Address updated"
    );
    setEditingAddress(false);
  };

  const pushToShiprocket = () => {
    if (!selectedPickup) {
      setMessage("Select a pickup location first");
      return;
    }

    runAction(
      "shiprocket",
      () => fetch(`${API_URL}/shiprocket/orders/${id}/shiprocket`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ pickup_location_id: selectedPickup }),
      }),
      "Order packed in Shiprocket"
    );
  };

  const generateAwb = () => {
    runAction(
      "awb",
      () => fetch(`${API_URL}/shiprocket/orders/${id}/awb`, {
        method: "POST",
        headers: authHeaders,
      }),
      "AWB generated"
    );
  };

  const downloadLabel = () => {
    runAction(
      "label",
      () => fetch(`${API_URL}/shiprocket/orders/${id}/label`, {
        method: "POST",
        headers: authHeaders,
      }),
      "Shipping label opened"
    );
  };

  const downloadInvoice = () => {
    runAction(
      "invoice",
      () => fetch(`${API_URL}/shiprocket/orders/${id}/invoice`, {
        method: "POST",
        headers: authHeaders,
      }),
      "Shiprocket invoice opened"
    );
  };

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading order...</h2>;
  }

  if (!order) {
    return <h2 style={{ padding: "40px" }}>Order not found</h2>;
  }

  return (
    <div className="order-details-page">
      <div className="order-details-card">
        <div className="order-header">
          <div>
            <h1>Order #{order.id}</h1>
            <p>{new Date(order.created_at).toLocaleString("en-IN")}</p>
          </div>

          <button className="back-btn" onClick={() => navigate("/orders")}>
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {message && <div className="admin-order-message">{message}</div>}

        <div className="order-admin-toolbar">
          <label>
            Order Status
            <select
              value={order.order_status || "Placed"}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={busy === "status"}
            >
              <option>Placed</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
              <option>Returned</option>
              <option>Cancelled</option>
            </select>
          </label>

          <label>
            Pickup Location
            <select
              value={selectedPickup}
              onChange={(e) => setSelectedPickup(e.target.value)}
              disabled={pickupLocations.length === 0}
            >
              <option value="">Select pickup location</option>
              {pickupLocations.map((location) => {
                const locationId = location.id || location.pickup_location_id;
                const name = location.name || location.pickup_location || "Pickup";
                return (
                  <option key={locationId} value={locationId}>
                    {name} - {location.city}, {location.state}
                  </option>
                );
              })}
            </select>
          </label>

          <button onClick={fetchPickupLocations} className="secondary-action" disabled={busy}>
            <RefreshCw size={16} />
            Refresh Pickups
          </button>
        </div>

        <div className="order-info">
          <div className="info-row"><span>Customer</span><strong>{order.customer_name}</strong></div>
          <div className="info-row"><span>Phone</span><strong>{order.customer_phone}</strong></div>
          <div className="info-row"><span>Email</span><strong>{order.customer_email || "N/A"}</strong></div>
          <div className="info-row"><span>Total Amount</span><strong>Rs {order.total_amount}</strong></div>
          <div className="info-row"><span>Payment Method</span><strong>{order.payment_method}</strong></div>
          <div className="info-row"><span>Payment Status</span><strong>{order.payment_status}</strong></div>
          <div className="info-row"><span>Shiprocket Order</span><strong>{order.shiprocket_order_id || "Not packed"}</strong></div>
          <div className="info-row"><span>AWB</span><strong>{order.awb_code || "Not generated"}</strong></div>
        </div>

        <div className="address-panel">
          <div className="section-title-row">
            <h2>Shipping Address</h2>
            <button className="secondary-action" onClick={() => setEditingAddress((value) => !value)}>
              <Edit3 size={16} />
              {editingAddress ? "Cancel" : "Edit Address"}
            </button>
          </div>

          {editingAddress ? (
            <div className="address-edit-grid">
              {["house_no", "street_area", "landmark", "city", "state", "pincode"].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.replace(/_/g, " ")}
                  value={addressForm[field] || ""}
                  onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })}
                />
              ))}
              <textarea
                name="address"
                placeholder="Complete address"
                value={addressForm.address || ""}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
              />
              <button className="primary-action" onClick={saveAddress} disabled={busy === "address"}>
                <Save size={16} />
                Save Address
              </button>
            </div>
          ) : (
            <p className="address-text">
              {order.address}, {order.city}, {order.state} - {order.pincode}
            </p>
          )}
        </div>

        <div className="shiprocket-actions">
          <button className="primary-action" onClick={pushToShiprocket} disabled={busy || order.shiprocket_order_id}>
            <PackageCheck size={18} />
            {order.shiprocket_order_id ? "Packed" : busy === "shiprocket" ? "Packing..." : "Pack Order"}
          </button>
          <button className="secondary-action" onClick={generateAwb} disabled={busy || !order.shiprocket_shipment_id || order.awb_code}>
            <Truck size={18} />
            {order.awb_code ? "AWB Ready" : "Generate AWB"}
          </button>
          <button className="secondary-action" onClick={downloadInvoice} disabled={busy || !order.shiprocket_order_id}>
            <ReceiptText size={18} />
            SR Invoice
          </button>
          <button className="secondary-action" onClick={downloadLabel} disabled={busy || !order.shiprocket_shipment_id}>
            <FileText size={18} />
            Shipping Label
          </button>
        </div>

        <hr />

        <h2 className="products-heading">Purchased Products ({items.length})</h2>

        <div className="products-list">
          {items.map((item, index) => (
            <div className="product-card" key={index}>
              <div className="product-image">
                <img src={item.product_image} alt={item.product_name} />
              </div>

              <div className="product-details">
                <h3>{item.product_name}</h3>
                <p><strong>Package:</strong> {item.package_size || "N/A"}</p>
                <p><strong>Price:</strong> Rs {item.price}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Subtotal:</strong> Rs {item.subtotal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
