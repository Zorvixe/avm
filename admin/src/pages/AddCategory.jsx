import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCategory.css";

const API_URL=process.env.BACKEND_API_URL || "http://localhost:5000"

function AddCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
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

      const response = await fetch(`${API_URL}/categories/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Category created successfully.");
        navigate("/categories");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category-page">

      <div className="add-category-header">
        <h1>Add Category</h1>
        <p>Create a new product category</p>
      </div>

      <div className="add-category-card">

        <form
          className="add-category-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>Category Name *</label>

            <input
              type="text"
              name="name"
              placeholder="Example: Granular"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Slug</label>

            <input
              type="text"
              name="slug"
              placeholder="granular"
              value={formData.slug}
              onChange={handleChange}
            />

            <small>
              Leave empty to generate automatically.
            </small>

          </div>

          <div className="checkbox-group">

            <label>

              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />

              Active Category

            </label>

          </div>

          <div className="button-group">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/categories")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Category"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddCategory;