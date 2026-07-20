import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SquarePen, Trash2 } from "lucide-react";
import "./ProductsList.css";

function ProductsList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1000);

  return () => clearTimeout(timer);
}, []);

  const API_URL = "http://localhost:5000";

  const fetchProducts = async () => {
    try {
     

      const response = await fetch(`${API_URL}/products/get`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error(err);
    } 
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/products/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Product deleted successfully.");

      // Reload products
      fetchProducts();

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase();

    return (
      (product.title || "").toLowerCase().includes(text) ||
      (product.subtitle || "").toLowerCase().includes(text) ||
      (product.category || "").toLowerCase().includes(text) ||
      (product.badge || "").toLowerCase().includes(text)
    );
  });


  return (
    <div className="products-list-page">
      <div className="products-list-header">
        <h1>Products List</h1>

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Badge</th>
              <th>Stock</th>
              <th>Packages</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const stock = (product.stock || "").toLowerCase();

                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>

                    <td>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="product-img"
                        onError={(e) => {
                          e.target.src = "/images/no-image.png";
                        }}
                      />
                    </td>

                    <td>
                      <strong>{product.title}</strong>
                      <br />
                      <small>{product.subtitle}</small>
                    </td>

                    <td>{product.category}</td>

                    <td>
                      <span className="product-badge">
                        {product.badge}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          stock === "in stock"
                            ? "stock in-stock"
                            : stock === "low stock"
                            ? "stock low-stock"
                            : "stock out-stock"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                   <td>
  <span className="package-count">
    {product.packageSizes?.length || 0}{" "}
    {product.packageSizes?.length === 1 ? "Package" : "Packages"}
  </span>
</td>

                    <td className="product-actions">
                      <button
                        className="product-edit-btn"
                        onClick={() =>
                          navigate(`/products/edit/${product.id}`)
                        }
                      >
                        <SquarePen size={18} />
                      </button>

                      <button
                        className="product-delete-btn"
                        onClick={() =>
                          handleDelete(product.id)
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsList;