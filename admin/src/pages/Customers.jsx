import { useState } from "react";
import "./Customers.css";
import { Search, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Customers() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const customers = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "+91 9876543210",
      city: "Hyderabad",
      orders: 12,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=11",
    },
    {
      id: 2,
      name: "Priya Reddy",
      email: "priya@gmail.com",
      phone: "+91 9123456780",
      city: "Warangal",
      orders: 8,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=32",
    },
    {
      id: 3,
      name: "Vikram Kumar",
      email: "vikram@gmail.com",
      phone: "+91 9988776655",
      city: "Karimnagar",
      orders: 3,
      status: "Inactive",
      image: "https://i.pravatar.cc/100?img=15",
    },
    {
      id: 4,
      name: "Sneha Patel",
      email: "sneha@gmail.com",
      phone: "+91 9345678901",
      city: "Bangalore",
      orders: 15,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=25",
    },
  ];

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(searchText) ||
      customer.email.toLowerCase().includes(searchText) ||
      customer.phone.includes(search) ||
      customer.city.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h1>Customers</h1>

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-info">
                      <img
                        src={customer.image}
                        alt={customer.name}
                      />
                      <span>{customer.name}</span>
                    </div>
                  </td>

                  <td>{customer.email}</td>

                  <td>{customer.phone}</td>

                  <td>{customer.city}</td>

                  <td>{customer.orders}</td>

                  <td>
                    <span
                      className={
                        customer.status === "Active"
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {customer.status}
                    </span>
                  </td>
  
                 <td className="product-actions">
               <button
                  className="product-edit-btn"
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  <Eye size={18} />
                </button>

                <button className="product-delete-btn">
                  <Trash2 size={18} />
                </button>
              </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#64748b",
                    fontWeight: "500",
                  }}
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;