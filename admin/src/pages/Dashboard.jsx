import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* Banner */}

      <div className="dashboard-banner">

        <div>
          <h1>Welcome Back </h1>

          <p>
            Manage products, customers and orders from one place.
          </p>
        </div>

        <img
    src="https://i.pravatar.cc/150?img=12"
    alt="Admin"
    className="dashboard-profile-img"
  />

      </div>

      {/* Statistics */}

      <div className="dashboard-cards">

        <div className="stat-card green">

          <div className="stat-icon">
            <Package size={30} />
          </div>

          <div className="stat-content">
            <div className="stat-title">Total Products</div>
            <div className="stat-value">128</div>
            <div className="stat-change">+12 this month</div>
          </div>

        </div>

        <div className="stat-card gold">

          <div className="stat-icon">
            <ShoppingCart size={30} />
          </div>

          <div className="stat-content">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">526</div>
            <div className="stat-change">+18 today</div>
          </div>

        </div>

        <div className="stat-card blue">

          <div className="stat-icon">
            <Users size={30} />
          </div>

          <div className="stat-content">
            <div className="stat-title">Customers</div>
            <div className="stat-value">324</div>
            <div className="stat-change">+5 today</div>
          </div>

        </div>

        <div className="stat-card orange">

          <div className="stat-icon">
            <IndianRupee size={30} />
          </div>

          <div className="stat-content">
            <div className="stat-title">Revenue</div>
            <div className="stat-value">₹2.45L</div>
            <div className="stat-change">This Month</div>
          </div>

        </div>

      </div>

      {/* Bottom Section */}

      <div className="dashboard-bottom">

        <div className="sales-card">

          <div className="section-title">
            <TrendingUp size={20} />
            <h3>Sales Overview</h3>
          </div>

          <div className="chart-placeholder">
            📈 Sales Chart
          </div>

        </div>

        <div className="stock-card">

          <div className="section-title">
            <AlertTriangle size={20} />
            <h3>Low Stock Products</h3>
          </div>

          <ul>

            <li>
              <span>Potash</span>
              <strong>5 Left</strong>
            </li>

            <li>
              <span>DAP Fertilizer</span>
              <strong>8 Left</strong>
            </li>

            <li>
              <span>NPK 20:20:20</span>
              <strong>10 Left</strong>
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;