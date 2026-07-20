import { useState, useEffect } from "react";
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
function AddProduct() {
  const [product, setProduct] = useState(initialProduct);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1000);

  return () => clearTimeout(timer);
}, []);
  
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

const handlePackageChange = (index, field, value) => {
  const updated = [...product.packageSizes];

  updated[index][field] = value;

  setProduct((prev) => ({
    ...prev,
    packageSizes: updated,
  }));
};
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setAdding(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/products/post",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || data.message);
      return;
    }

    alert("Product Added Successfully");

    setProduct(initialProduct);

  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setAdding(false);
  }
};


  return (
    <div className="admin-page">

      <div className="admin-card">

        <h1>Add New Product</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="input-group">
              <label>Product Title</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                placeholder="Enter title"
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
                placeholder="Enter subtitle"
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
                placeholder="Best Seller"
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
      onChange={(e)=>
      handlePackageChange(
      index,
      "size",
      e.target.value
      )}
      />

     <input
  type="text"
  placeholder="Price (Ex: ₹500)"
  value={pkg.price}
  onChange={(e) =>
    handlePackageChange(
      index,
      "price",
      e.target.value
    )
  }
/>

      {product.packageSizes.length>1 && (

      <button
      type="button"
      className="remove-package-btn"
      onClick={()=>
      removePackage(index)
      }
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
              <label>Slug</label>
              <input
                type="text"
                name="slug"
                value={product.slug}
                onChange={handleChange}
                placeholder="npk-20-20-20"
              />
            </div>

            <div className="input-group full">
              <label>Description</label>
              <textarea
                rows="5"
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Product Description"
              />
            </div>

            {/* Suitable Crops */}

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

              {/* Key Benefits */}

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
    disabled={adding}
  >
    {adding ? (
      "Adding..."
    ) : (
      <SplitButtonText
        text="Add Product"
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

export default AddProduct;