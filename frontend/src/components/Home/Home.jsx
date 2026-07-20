import { useEffect, useState } from "react";
import HeroSection from "../HeroSection/HeroSection";
import Stats from "../HeroSection/Stats";
import AboutSection from "../../pages/AboutSection";
import "../../pages/ProductsPages.css"
import { ArrowRight } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import AnimatedWave from "../../animations/AnimatedWave";
import "./Home.css"
import { TbBulb } from "react-icons/tb";
import FarmerVoices from "../../pages/FarmerVoices";

import {
  UserRound,
  Leaf,
  BadgeCheck,
  Globe,
  TrendingUp,
   ChevronUp,ChevronDown
} from "lucide-react";


import farmer1 from "../../assets/farmer-1.jpg";
import farmer2 from  "../../assets/farmer-2.jpg";
import farmer3 from  "../../assets/farmer-3.jpg";
import { FaStar, FaRegStar } from "react-icons/fa";

const values = [
  {
    icon: <TbBulb size={34} />,
    title: "Innovation-Driven",
    subtitle: "Solutions",
    active: false,
  },
  {
    icon: <UserRound size={34} />,
    title: "Farmer-Centric",
    subtitle: "Approach",
    active: false,
  },
  {
    icon: <Leaf size={34} />,
    title: "Sustainability at the",
    subtitle: "Core",
    active: false,
  },
  {
    icon: <BadgeCheck size={34} />,
    title: "Trusted Quality &",
    subtitle: "Performance",
    active: false,
  },
  {
    icon: <Globe size={34} />,
    title: "Global Vision, Local",
    subtitle: "Support",
    active: false,
  },
  {
    icon: <TrendingUp size={34} />,
    title: "Commitment",
    subtitle: "to Future Farming",
    active: false,
  },
];

const testimonials = [
  {
    image: farmer1,
    name: "Ramesh Kumar",
    place: "Telangana",
    review: "Excellent fertilizer. My crop yield increased by 30%.",
     rating: 4,
  },
  {
    image: farmer2,
    name: "Suresh Patel",
    place: "Andhra Pradesh",
     rating: 3,
    review: "Very good quality and fast results. Highly recommended.",
  },
  {
    image: farmer3,
    name: "Mahesh Reddy",
    place: "Karnataka",
     rating: 5,
    review: "Healthy plants and better soil fertility after using it.",
  },
];

export const faqs = [
  {
    question: "What types of fertilizers do you offer?",
    answer:
      "We offer a wide range of fertilizers, including NPK fertilizers, micronutrient fertilizers, water-soluble fertilizers, organic fertilizers, and customized crop nutrition solutions for various crops.",
  },
  {
    question: "How do I choose the right fertilizer for my crop?",
    answer:
      "The right fertilizer depends on your crop type, soil condition, growth stage, and nutrient requirements. Our experts can help you select the most suitable product for maximum yield.",
  },
  {
    question: "Are your fertilizers safe for the environment?",
    answer:
      "Yes. Our fertilizers are developed to improve crop productivity while promoting sustainable farming practices and minimizing environmental impact when used as recommended.",
  },
  {
    question: "Can your fertilizers be used for all crops?",
    answer:
      "Our products are suitable for a wide variety of crops, including cereals, fruits, vegetables, pulses, oilseeds, cotton, sugarcane, and horticultural crops. Always follow the recommended dosage for your specific crop.",
  },
  {
    question: "How often should fertilizers be applied?",
    answer:
      "Application frequency varies depending on the crop and soil condition. Generally, fertilizers are applied during land preparation, planting, and key growth stages for the best results.",
  }
];

function Home() {
  const navigate = useNavigate();
  const cards = [...testimonials, ...testimonials];
  const [openIndex, setOpenIndex] = useState(null);
  const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products/get");
      const data = await response.json();

      if (data.success) {
        // Show only first 3 products
        setProducts(data.data.slice(0, 3));
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchProducts();
}, []);

  return (
    <>
      <HeroSection />
      <Stats />
      <AboutSection/>
      
      <section className="products-section" id="products">

      <div className="products-top">

        <div className="products-heading">

          <span className="products-label">
            THE COLLECTION
          </span>

          <h2 className="products-title">
            Engineered for <br />
            <span>every</span> growth stage.
          </h2>

        </div>

        <div className="products-view">
        <Link to="/products">
          VIEW ALL PRODUCTS <span>↗</span>
        </Link>
      </div>

      </div>

      <div className="products-container">

       {products.slice(0, 3).map((item) => (

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

      <span className="product-npk">
        {item.npk}
      </span>

    </div>

    <div className="product-card-body">

      <h5>{item.subtitle}</h5>

      <h2>{item.title}</h2>

      <p>{item.description}</p>

      <div className="product-footer">

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

    <section className="wave-section">
    <AnimatedWave />
    </section>

      <section className="values-section">
      <h2 className="values-heading">
        OUR <span>VALUES</span>
      </h2>

      <div className="values-grid">
        {values.map((item, index) => (
          <div
            className={`value-card ${item.active ? "active" : ""}`}
            key={index}
          >
            <div className="left-shape">

          <div className="white-circle">

              <div className="ring"></div>

              <div className="icon-circle">
                  {item.icon}
              </div>

          </div>

      </div>

            <div className="content">
              <h3>{item.title}</h3>
              <h3>{item.subtitle}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>

     <FarmerVoices/>

      <section className="faq-section">
          <p className="faq-subtitle">FAQ</p>
          <h2 className="faq-title"> Questions, answered.</h2>

          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${
                openIndex === index ? "active" : ""
              }`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span>{faq.question}</span>

                <span className="faq-icon">
                  {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>

              <div
                className={`faq-answer ${
                  openIndex === index ? "open" : ""
                }`}
              >
                <div className="faq-answer-content">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </section>

    </>
  );
}

export default Home;