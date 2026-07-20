import { useEffect, useState } from "react";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000";
console.log(localStorage.getItem("customer_phone"));

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      const phone = localStorage.getItem("customer_phone");

      if (!phone) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/my/${phone}`
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);
const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmDelete) return;


  try {

    const response = await fetch(
      `${API_URL}/orders/delete/${id}`,
      {
        method: "DELETE"
      }
    );


    const data = await response.json();


    if(data.success){

      // remove deleted order from UI
      setOrders(
        orders.filter(
          (order)=> order.id !== id
        )
      );

    }


  } catch(error){

    console.log(error);

  }

};

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loader"></div>
        <h2>Loading Orders...</h2>
      </div>
    );
  }

  return (
    <section className="my-orders-page">

      <h1 className="orders-title">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders.</p>
        </div>
      ) : (
        <div className="orders-grid">
  {orders.map((order) => (
    <div className="order-card" key={order.id}>

      <div className="order-left">
        <img
          src={order.product_image}
          alt={order.product_name}
          className="product-image"
        />
      </div>

      <div className="order-center">

        <h2>{order.product_name}</h2>

        <div className="order-info">

          <div>
            <span>Package</span>
            <p>{order.package_size}</p>
          </div>

          <div>
            <span>Quantity</span>
            <p>{order.quantity}</p>
          </div>

          <div>
            <span>Price</span>
            <p>₹{order.price}</p>
          </div>

          <div>
            <span>Total</span>
            <p>₹{order.total_amount}</p>
          </div>

        </div>

        <small>
          Ordered on{" "}
          {new Date(order.created_at).toLocaleDateString("en-IN")}
        </small>

      </div>

      <div className="order-right">

        <span
          className={`status ${(order.order_status || "")
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {order.order_status}
        </span>

        <button
          className="delete-order-btn"
          onClick={() => handleDelete(order.id)}
        >
          Delete Order
        </button>

      </div>

    </div>
  ))}
</div>
      )}
    </section>
  );
}

export default MyOrders;