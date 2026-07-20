import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Orders.css";

function OrdersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1000);

  return () => clearTimeout(timer);
}, []);
useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/orders/get"
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      }

    } catch (error) {
      console.log(error);
    }
  };

  fetchOrders();
}, []);

 const filteredOrders = orders.filter((order) => {

  const text = search.toLowerCase();

  return (
    String(order.id).includes(text) ||

    (order.customer_name || "")
      .toLowerCase()
      .includes(text) ||

    (order.product_name || "")
      .toLowerCase()
      .includes(text) ||

    (order.order_status || "")
      .toLowerCase()
      .includes(text)
  );

});

  return (
    <div className="orders-page">

      <div className="orders-header">

        <h1>Orders List</h1>

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      <div className="orders-table">

        <table>

  <thead>

    <tr>

      <th>Order ID</th>

      <th>Customer</th>

      <th>Phone</th>

      <th>Total Products</th>

      <th>Total Qty</th>

      <th>Total Amount</th>

      <th>Payment</th>

      <th>Status</th>

      <th>Date</th>

      <th>Action</th>

    </tr>

  </thead>

  <tbody>
  {loading ? (
    <tr>
      <td
        colSpan="10"
        style={{
          textAlign: "center",
          padding: "30px",
          color: "#64748b",
          fontWeight: "600",
        }}
      >
        Loading orders...
      </td>
    </tr>
  ) : filteredOrders.length > 0 ? (
    filteredOrders.map((order) => (
      <tr key={order.id}>
        <td>#{order.id}</td>

        <td>
          <div className="customer-cell">
            <h4>{order.customer_name}</h4>
            <span>{order.customer_email}</span>
          </div>
        </td>

        <td>{order.customer_phone}</td>

        <td>{order.total_products}</td>

        <td>{order.total_quantity}</td>

        <td>₹{order.total_amount}</td>

        <td>
          <span
            className={`status ${(order.payment_status || "").toLowerCase()}`}
          >
            {order.payment_method}
          </span>
        </td>

        <td>
          <span
            className={`status ${
              order.order_status
                ?.toLowerCase()
                .replace(/\s+/g, "-") || ""
            }`}
          >
            {order.order_status}
          </span>
        </td>

        <td>
          {new Date(order.created_at).toLocaleDateString("en-IN")}
        </td>

        <td>
          <button
            className="product-edit-btn"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <Eye size={18} />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="10"
        style={{
          textAlign: "center",
          padding: "30px",
          color: "#64748b",
          fontWeight: "600",
        }}
      >
        No Orders Found
      </td>
    </tr>
  )}
</tbody>

</table>

      </div>

    </div>
  );
}

export default OrdersPage;