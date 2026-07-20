import { useNavigate, useParams } from "react-router-dom";
import "./CustomerDetails.css";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = {
    id,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    city: "Hyderabad",
    address: "Madhapur, Hyderabad, Telangana - 500081",
    orders: 12,
    status: "Active",
    joined: "10 Jan 2025",
    image: "https://i.pravatar.cc/300?img=11",
  };

  return (
    <div className="customer-page-wrapper">
      <div className="customer-card-box">

        <div className="customer-top-bar">
          <h1>Customer Details</h1>

          <button
            className="customer-back-button"
            onClick={() => navigate("/customers")}
          >
            Back
          </button>
        </div>

        <div className="customer-body">

          <div className="customer-profile-card">
            <img
              src={customer.image}
              alt={customer.name}
              className="customer-profile-image"
            />

            <h2>{customer.name}</h2>
            <p>{customer.city}</p>
          </div>

          <div className="customer-details-card">

            <div className="customer-item">
              <label>Customer ID</label>
              <p>{customer.id}</p>
            </div>

            <div className="customer-item">
              <label>Name</label>
              <p>{customer.name}</p>
            </div>

            <div className="customer-item">
              <label>Email</label>
              <p>{customer.email}</p>
            </div>

            <div className="customer-item">
              <label>Phone</label>
              <p>{customer.phone}</p>
            </div>

            <div className="customer-item">
              <label>City</label>
              <p>{customer.city}</p>
            </div>

            <div className="customer-item">
              <label>Address</label>
              <p>{customer.address}</p>
            </div>

            <div className="customer-item">
              <label>Total Orders</label>
              <p>{customer.orders}</p>
            </div>

            <div className="customer-item">
              <label>Status</label>

              <span
                className={
                  customer.status === "Active"
                    ? "customer-status-active"
                    : "customer-status-inactive"
                }
              >
                {customer.status}
              </span>
            </div>

            <div className="customer-item">
              <label>Joined</label>
              <p>{customer.joined}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CustomerDetails;