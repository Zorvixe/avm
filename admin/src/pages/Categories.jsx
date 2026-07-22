import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";
import "./Categories.css";

const API_URL = "http://localhost:5000";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/categories/get`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
        setFilteredCategories(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const result = categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredCategories(result);
  }, [search, categories]);

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/categories/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchCategories();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="categories-loading">Loading...</div>;
  }

  return (
    <div className="categories-page">

      <div className="categories-header">

        <h1>Categories</h1>

        <Link
          to="/categories/add"
          className="add-category-btn"
        >
          <Plus size={18} />
          Add Category
        </Link>

      </div>

      <div className="category-toolbar">

        <div className="category-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      <div className="category-table-wrapper">

        <table className="category-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No Categories Found
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id}>

                  <td>{category.id}</td>

                  <td>
                    <span className="category-name">
                      {category.name}
                    </span>
                  </td>

                  <td>
                    <span className="category-slug">
                      {category.slug}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        category.is_active
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {category.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>

                    <div className="category-actions">

                      <Link
                        to={`/categories/edit/${category.id}`}
                        className="edit-btn"
                      >
                        <SquarePen size={18} />
                      </Link>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteCategory(category.id)
                        }
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Categories;