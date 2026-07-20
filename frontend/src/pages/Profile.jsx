import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    if (!data) return;

    setUser(data);

    fetch(`http://localhost:5000/orders/user/${data.email}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setOrders(result.data);
        }
      });
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile Updated Successfully");
  };

  return (
    <section className="profile-page">

      <div className="profile-wrapper">

        {/* LEFT */}

        <div className="profile-card">

          <div className="profile-top">

            <div className="profile-avatar">
              {user.full_name?.charAt(0)}
            </div>

            <h2>{user.full_name}</h2>

            <p>{user.email}</p>

          </div>

          <div className="profile-form">

            <input
              name="full_name"
              value={user.full_name}
              onChange={handleChange}
              placeholder="Full Name"
            />

            <input
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <input
              name="phone"
              value={user.phone}
              onChange={handleChange}
              placeholder="Phone"
            />

            <textarea
              rows="3"
              name="address"
              value={user.address}
              onChange={handleChange}
              placeholder="Address"
            />

            <input
              name="city"
              value={user.city}
              onChange={handleChange}
              placeholder="City"
            />

            <input
              name="state"
              value={user.state}
              onChange={handleChange}
              placeholder="State"
            />

            <input
              name="pincode"
              value={user.pincode}
              onChange={handleChange}
              placeholder="Pincode"
            />

            <button onClick={handleUpdate}>
              Update Profile
            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="profile-orders">

  <h2>Recent Orders</h2>

  {orders.length > 0 ? (

    orders.map((order) => (

      <div
        className="profile-order-card"
        key={order.id}
      >

        <div className="profile-order-image">

        <img
    src={order.product_image}
    alt={order.product_name}
    onClick={() =>
        navigate(`/products/${order.product_slug}`)
    }
/>

        </div>

        <div className="profile-order-info">

          <h3>{order.product_name}</h3>

          <p>
            Order #{order.id}
          </p>

          <p>
            Qty : {order.quantity}
          </p>

          <p>
            ₹{order.price}
          </p>

          <p>
            {new Date(order.created_at).toLocaleDateString()}
          </p>

        </div>

        <div>

          <span
            className={`status-badge ${order.order_status.toLowerCase()}`}
          >
            {order.order_status}
          </span>

        </div>

      </div>

    ))

  ) : (

    <p>No Orders Yet.</p>

  )}

</div>

      </div>

    </section>
  );
}

export default Profile;