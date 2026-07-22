import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditCategory.css";

const API_URL = "http://localhost:5000";

function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    is_active: true,
  });

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await fetch(
        `${API_URL}/categories/get/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setFormData({
          name: data.data.name || "",
          slug: data.data.slug || "",
          is_active: data.data.is_active,
        });
      } else {
        alert(data.message);
        navigate("/categories");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load category.");
    }
  };

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

      const response = await fetch(
        `${API_URL}/categories/update/${id}`,
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
        alert("Category updated successfully.");
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
    <div className="edit-category-page">

      <div className="edit-category-header">
        <h1>Edit Category</h1>
        <p>Update category information</p>
      </div>

      <div className="edit-category-card">

        <form
          className="edit-category-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>Category Name *</label>

            <input
              type="text"
              name="name"
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
              value={formData.slug}
              onChange={handleChange}
            />

            <small>
              URL friendly name
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
              {loading ? "Updating..." : "Update Category"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditCategory;