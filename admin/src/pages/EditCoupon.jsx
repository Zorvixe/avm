import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditCoupon.css";

const API_URL = "http://localhost:5000";

function EditCoupon() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order: "",
    max_discount: "",
    hidden: false,
    is_active: true,
  });

  useEffect(() => {
    fetchCoupon();
  }, []);

  const fetchCoupon = async () => {
    try {
      const response = await fetch(
        `${API_URL}/coupons/get/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setFormData({
          code: data.data.code || "",
          discount_type:
            data.data.discount_type || "percentage",
          discount_value:
            data.data.discount_value || "",
          min_order: data.data.min_order || "",
          max_discount:
            data.data.max_discount || "",
          hidden: data.data.hidden,
          is_active: data.data.is_active,
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Unable to fetch coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/coupons/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Coupon updated successfully");
        navigate("/coupons");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="coupon-loading">
        Loading Coupon...
      </div>
    );
  }

  return (
    <div className="edit-coupon-page">

      <div className="edit-coupon-header">
        <h1>Edit Coupon</h1>
        <p>Update discount coupon details</p>
      </div>

      <div className="edit-coupon-card">

        <form
          className="edit-coupon-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>Coupon Code *</label>

            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Discount Type</label>

            <select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
            >
              <option value="percentage">
                Percentage (%)
              </option>

              <option value="fixed">
                Fixed Amount (₹)
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Discount Value *</label>

            <input
              type="number"
              name="discount_value"
              value={formData.discount_value}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Minimum Order</label>

            <input
              type="number"
              name="min_order"
              value={formData.min_order}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Maximum Discount</label>

            <input
              type="number"
              name="max_discount"
              value={formData.max_discount}
              onChange={handleChange}
            />

            <small>
              Leave empty for unlimited discount.
            </small>
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
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Coupon"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditCoupon;