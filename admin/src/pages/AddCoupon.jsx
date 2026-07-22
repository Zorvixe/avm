import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCoupon.css";
import {
  Plus,
  SquarePen,
  Trash2,
  Search,
  TicketPercent,
} from "lucide-react";
import "./Coupons.css";

const API_URL=process.env.BACKEND_API_URL || "http://localhost:5000"

function AddCoupon() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order: "",
    max_discount: "",
    hidden: false,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/coupons/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Coupon created successfully");
        navigate("/coupons");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-coupon-page">

      <div className="add-coupon-header">
        <h1>Add Coupon</h1>
        <p>Create a new discount coupon</p>
      </div>

      <div className="add-coupon-card">

        <form className="add-coupon-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Coupon Code *</label>
            <input
              type="text"
              name="code"
              placeholder="Enter Code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Discount Type *</label>

            <select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Discount Value *</label>
            <input
              type="number"
              name="discount_value"
              placeholder="Enter Value"
              value={formData.discount_value}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Minimum Order Amount (₹)</label>
            <input
              type="number"
              name="min_order"
              placeholder="Enter Min Discount"
              value={formData.min_order}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Maximum Discount Cap (₹)</label>
            <input
              type="number"
              name="max_discount"
              placeholder="Enter Max Discount"
              value={formData.max_discount}
              onChange={handleChange}
            />
            <small>Leave empty for no maximum discount.</small>
          </div>

          <div className="checkbox-group">

            <label>
              <input
                type="checkbox"
                name="hidden"
                checked={formData.hidden}
                onChange={handleChange}
              />
              Hidden (Promo Code Only)
            </label>

            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active
            </label>

          </div>

          <div className="button-group">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/coupons")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Coupon"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddCoupon;