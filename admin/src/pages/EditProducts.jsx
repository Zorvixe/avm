import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AddProducts.css";
import SplitButtonText from "../animations/SplitButtonText";

const initialProduct = {
  title: "",
  subtitle: "",
  category: "",
  badge: "",
  description: "",
  image: "",
  slug: "",
  stock: "",

  packageSizes: [
    {
      size: "",
      price: "",
    },
  ],

  crops: "",
  features: "",

  nitrogen: "",
  phosphorus: "",
  potassium: "",
  sulphur: "",
  zinc: "",
};

const API_URL=process.env.BACKEND_API_URL || "http://localhost:5000"

function EditProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(initialProduct);
  const [updating, setUpdating] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1000);

  return () => clearTimeout(timer);
}, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products/get/${id}`
        );

        const data = await response.json();

        if (data.success) {
          setProduct({
            ...initialProduct,
            ...data.data,
            packageSizes:
              data.data.packageSizes?.length > 0
                ? data.data.packageSizes
                : [
                    {
                      size: "",
                      price: "",
                    },
                  ],
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePackageChange = (index, field, value) => {
    const updated = [...product.packageSizes];

    updated[index][field] = value;

    setProduct((prev) => ({
      ...prev,
      packageSizes: updated,
    }));
  };

  const addPackage = () => {
    setProduct((prev) => ({
      ...prev,
      packageSizes: [
        ...prev.packageSizes,
        {
          size: "",
          price: "",
        },
      ],
    }));
  };

  const removePackage = (index) => {
    setProduct((prev) => ({
      ...prev,
      packageSizes: prev.packageSizes.filter(
        (_, i) => i !== index
      ),
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setUpdating(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/products/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || data.error);
      return;
    }

    alert("Product Updated Successfully");
    navigate("/productsList");

  } catch (error) {
    console.log(error);
    alert("Something went wrong.");

  } finally {
    setUpdating(false);
  }
};

  return (
    <div className="admin-page">
      <div className="admin-card">

        <div className="customer-top-bar">
          <h1>Edit Product</h1>

          <button
            className="customer-back-button"
            onClick={() => navigate("/productsList")}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="input-group">
              <label>Product Title</label>

              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Subtitle</label>

              <input
                type="text"
                name="subtitle"
                value={product.subtitle}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Category</label>

              <select
                name="category"
                value={product.category}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="FERTILIZER">FERTILIZER</option>
                <option value="BIO">BIO</option>
                <option value="MICRONUTRIENTS">MICRONUTRIENTS</option>
                <option value="SPECIALITY">SPECIALITY</option>
              </select>
            </div>

            <div className="input-group">
              <label>Badge</label>

              <input
                type="text"
                name="badge"
                value={product.badge}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Stock</label>

              <select
                name="stock"
                value={product.stock}
                onChange={handleChange}
              >
                <option value="">Select Stock</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="package-card full">

              <h2>Package Sizes</h2>

              {product.packageSizes.map((pkg, index) => (
                <div
                  className="package-row"
                  key={index}
                >
                  <input
                    type="text"
                    placeholder="500g / 1kg / 5kg / 1L"
                    value={pkg.size}
                    onChange={(e) =>
                      handlePackageChange(
                        index,
                        "size",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="text"
                    placeholder="Price"
                    value={pkg.price}
                    onChange={(e) =>
                      handlePackageChange(
                        index,
                        "price",
                        e.target.value
                      )
                    }
                  />

                  {product.packageSizes.length > 1 && (
                    <button
                      type="button"
                      className="remove-package-btn"
                      onClick={() => removePackage(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="add-package-btn"
                onClick={addPackage}
              >
                + Add Package
              </button>

            </div>
                        <div className="input-group full">
              <label>Image URL</label>

              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="Paste image URL"
              />
            </div>

            <div className="input-group full">
              <label>Image Preview</label>

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="preview-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/250x250?text=No+Image";
                  }}
                />
              ) : (
                <p className="no-preview">No image selected</p>
              )}
            </div>

            <div className="input-group full">
              <label>Slug</label>

              <input
                type="text"
                name="slug"
                value={product.slug}
                onChange={handleChange}
              />
            </div>

            <div className="input-group full">
              <label>Description</label>

              <textarea
                rows="5"
                name="description"
                value={product.description}
                onChange={handleChange}
              />
            </div>

            <div className="input-group full">
              <label>Suitable Crops</label>

              <textarea
                rows="3"
                name="crops"
                value={product.crops}
                onChange={handleChange}
                placeholder="Rice, Wheat, Cotton, Sugarcane"
              />
            </div>

            <div className="input-group full">
              <label>Key Benefits</label>

              <textarea
                rows="5"
                name="features"
                value={product.features}
                onChange={handleChange}
                placeholder="Improves Root Growth, Increases Yield, Better Flowering"
              />
            </div>

            <div className="composition-card full">

              <h2>Nutrient Composition</h2>

              <div className="composition-grid">

                <div className="input-group">
                  <label>Nitrogen (%)</label>

                  <input
                    type="text"
                    name="nitrogen"
                    value={product.nitrogen}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Phosphorus (%)</label>

                  <input
                    type="text"
                    name="phosphorus"
                    value={product.phosphorus}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Potassium (%)</label>

                  <input
                    type="text"
                    name="potassium"
                    value={product.potassium}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Sulphur (%)</label>

                  <input
                    type="text"
                    name="sulphur"
                    value={product.sulphur}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Zinc (%)</label>

                  <input
                    type="text"
                    name="zinc"
                    value={product.zinc}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </div>

          </div>

          <div className="add-button">

           <button
  type="submit"
  className="submit-btn"
  disabled={updating}
>
  {updating ? (
    "Updating..."
  ) : (
    <SplitButtonText
      text="Update Product"
      className="split-text"
      delay={0.04}
      duration={0.5}
    />
  )}
</button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProducts;