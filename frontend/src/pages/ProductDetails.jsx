import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetails.css";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { GrDeliver } from "react-icons/gr";
import { Package } from 'lucide-react';
import Loader from "../components/Loader/Loader";
function ProductDetails() {
  const navigate = useNavigate();
  const { slug } = useParams();
 
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);

const total =
  Number(selectedPackage?.price || 0) * quantity;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:5000/products/get");

       
        const data = await response.json();

        if (data.success) {
          const current = data.data.find((item) => item.slug === slug);

          setProduct(current);
          if (current.packageSizes?.length > 0) {
            setSelectedPackage(current.packageSizes[0]);
          }

          const related = data.data.filter(
            (item) => item.slug !== slug
          );

          setRelatedProducts(related.slice(0, 3));
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false)
      }
    };

    fetchProduct();
  }, [slug]);

 
if (loading) {
  return <Loader />;
}

if (!product) {
  return <h2>Product not found</h2>;
}

const handleAddToCart = () => {

  if (!selectedPackage) {
    alert("Please select a package.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find(
    (item) =>
      item.id === product.id &&
      item.size === selectedPackage.size
  );

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
  ...product,
  size: selectedPackage.size,
  price: selectedPackage.price,
  quantity,
});
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
  navigate("/cart");
};

  return (
    <section className="detail-page">
      <div className="detail-wrapper">

        <div className="detail-left">
          <img
            src={product.image}
            alt={product.title}
            className="detail-image"
          />

          {/* <div className="detail-npk">
            {product.npk}
          </div> */}
          <div className="purchase-card">

  <div className="price-stock-row">

    <div className="price-box">
      <h4>Price</h4>
     <h2 className="detail-price">

₹{(
  Number(selectedPackage?.price || 0) *
  quantity
).toFixed(2)}

</h2>

    </div>

    <div className="stock-box">
      <h4>Availability</h4>

      <span
        className={
          product.stock === "In Stock"
            ? "stock in-stock"
            : product.stock === "Low Stock"
            ? "stock low-stock"
            : "stock out-stock"
        }
      >
        {product.stock}
      </span>
    </div>

  </div>
  <div className="package-selection">

  <h4>Select Package</h4>

  <div className="package-buttons">

    {product.packageSizes?.map((pkg) => (

      <button
        key={pkg.size}
        type="button"
        className={
          selectedPackage?.size === pkg.size
            ? "package-btn active"
            : "package-btn"
        }
        onClick={() => {
          setSelectedPackage(pkg);
          setQuantity(1);
        }}
      >
        {pkg.size}
      </button>

    ))}

  </div>

</div>
<div className="quantity-section">

  <h4>Quantity</h4>

  <div className="quantity-box">

    <button
      type="button"
      onClick={() =>
        quantity > 1 && setQuantity(quantity - 1)
      }
    >
      −
    </button>

    <span>{quantity}</span>

    <button
      type="button"
      onClick={() =>
        setQuantity(quantity + 1)
      }
    >
      +
    </button>

  </div>

</div>

  <div className="delivery-info">

    <div className="delivery-item">
      <GrDeliver className="delivety-icons"/> <span>Delivery charges Apply</span>
    </div>

    <div className="delivery-item">
        <Package className="order-icons"/> <span>Delivery in 3–5 Days</span>
    </div>

  </div>

  <div className="purchase-buttons">

    <button
  className="cart-btn"
  onClick={handleAddToCart}
  disabled={product.stock === "Out of Stock"}
>
  Add to Cart
</button>

    <button
      className="buy-btn"
      disabled={product.stock === "Out of Stock"}
    >
      Buy Now
    </button>

  </div>

</div>
          
        </div>

        <div className="detail-right">

          <p className="detail-category">
            {product.badge} • {product.subtitle}
          </p>

          <h1 className="detail-title">
            {product.title}
          </h1>

          <p className="detail-description">
            {product.description}
          </p>

          <div className="detail-block">
            <h4>SUITABLE CROPS</h4>

            <div className="detail-crops">
              {product.crops
                ?.split(",")
                .map((crop) => (
                  <span key={crop}>{crop.trim()}</span>
                ))}
            </div>
          </div>

          <div className="detail-block">
            <h4>KEY BENEFITS</h4>

            <ul className="detail-benefits">
              {product.features
                ?.split(",")
                .map((feature) => (
                  <li key={feature}>{feature.trim()}</li>
                ))}
            </ul>
          </div>

          <div className="detail-composition">

            <h4>NUTRIENT COMPOSITION</h4>

            <table>
              <tbody>

                <tbody>

<tr>
  <td>Nitrogen (N)</td>
  <td>{product.nitrogen}%</td>
</tr>

<tr>
  <td>Phosphorus (P)</td>
  <td>{product.phosphorus}%</td>
</tr>

<tr>
  <td>Potassium (K)</td>
  <td>{product.potassium}%</td>
</tr>

<tr>
  <td>Sulphur (S)</td>
  <td>{product.sulphur}%</td>
</tr>

<tr>
  <td>Zinc (Zn)</td>
  <td>{product.zinc}%</td>
</tr>

</tbody>

              </tbody>
            </table>

          </div>

          <div className="contact-buttons">

            <a
              href={`https://wa.me/${product.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              <FaWhatsapp className="icon" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${product.phone}`}
              className="call-button"
            >
              <FaPhone className="icon" />
              <span>Call Now</span>
            </a>

          </div>

        </div>
      </div>

      <div className="related-products">

        <h2>You may also like</h2>

        <div className="related-grid">

          {relatedProducts.map((item) => (

            <Link
              key={item.id}
              to={`/products/${item.slug}`}
              className="related-card"
            >
              <img
                src={item.image}
                alt={item.title}
                className="related-image"
              />

              <div className="related-content">
                <p className="related-npk">
                  {item.npk}
                </p>

                <h3>{item.title}</h3>
              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}

export default ProductDetails;