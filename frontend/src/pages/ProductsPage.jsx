import "./ProductsPages.css";
import { ArrowRight, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";

function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true)
const response = await fetch("http://localhost:5000/products/get");


const data = await response.json();


      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    finally{
      setLoading(false)
    }
  };

  fetchProducts();
}, []);

  const filteredProducts = products.filter((item) => {
  const matchCategory =
    category === "ALL" ||
    item.category.toUpperCase() === category;

  const matchSearch =
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(search.toLowerCase());

  return matchCategory && matchSearch;
});
if (loading) {
  return <Loader />;
}
  return (
    <>
    <section className="products-section" id="products">

       <div className="products-top">

    <div className="products-heading">
      <span className="products-label">OUR PRODUCTS</span>

      <h2 className="products-title">
        Engineered for <br />
        every <span>growth stage.</span>
      </h2>
    </div>

    <div className="products-view">
      <a>
        VIEW ALL PRODUCTS 
      </a>
    </div>

  </div>

      <div className="products-container">

        {filteredProducts.map((item) => (

          <div className="product-card" key={item.id}>

            <div className="product-image-wrapper">

              <img
                className="product-image"
                src={item.image}
                alt={item.title}
              />

              <span className="product-badge">
                {item.badge}
              </span>


            </div>

            <div className="product-card-body">

              <h5>{item.subtitle}</h5>

              <h2>{item.title}</h2>

              <p>{item.description}</p>

              {/* <div className="product-tags">

                {item.crops.map((crop) => (
                  <span key={crop}>{crop}</span>
                ))}

              </div> */}

              {/* <ul>

                {item.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}

              </ul> */}

              <div className="product-footer">

  {/* <div className="product-price">

    {item.packageSizes?.length > 0 && (
      <>
        <h3>₹{item.packageSizes[0].price}</h3>
        <span>{item.packageSizes[0].size}</span>
      </>
    )}

  </div> */}

  <button
    onClick={() => navigate(`/products/${item.slug}`)}
  >
    VIEW DETAILS

    <div className="product-circle">
      <ArrowRight size={18} />
    </div>
  </button>

</div>

            </div>

          </div>

        ))}

      </div>

    </section>
    </>
    
  );
}

export default ProductsPage;