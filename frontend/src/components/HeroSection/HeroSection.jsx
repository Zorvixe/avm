import React from "react";
import { ArrowRight } from "lucide-react";
import heroBag from "../../assets/hero-bag.jpg";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section">

      <div className="hero-overlay"></div>
      <div className="hero-grid"></div>

      <div className="hero-container">

        {/* LEFT CONTENT */}

        <div className="hero-content">

          <div className="hero-tag">
            <span className="dot"></span>
            ADVANCING GLOBAL AGRICULTURE • EST. 1998
          </div>

          <h1 className="hero-title">
            Nurturing
            <br />

            <span>Growth</span>

            <br />

            Through
            <br />
            Science.
          </h1>

          <p className="hero-description">
            Premium bio-active fertilizers engineered for
            high-yield resilience and ecological harmony.
            Experience the luxury of sustainable abundance.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Explore Products
              <ArrowRight size={18} />
            </button>

            <button className="secondary-btn">
              Contact Us
            </button>

          </div>

          {/* <div className="hero-stats">

            <div className="stat">
              <h2>25+</h2>
              <p>Countries Served</p>
            </div>

            <div className="stat">
              <h2>98%</h2>
              <p>Customer Satisfaction</p>
            </div>

            <div className="stat">
              <h2>1M+</h2>
              <p>Farmers Empowered</p>
            </div>

          </div> */}

        </div>

        {/* RIGHT IMAGE */}

        <div className="hero-image-wrapper">

          <div className="circle circle-one"></div>
          <div className="circle circle-two"></div>

          <img
            src={heroBag}
            alt="Premium Fertilizer"
            className="hero-image"
          />

          <div className="badge badge-top">
            <span>NPK</span>
            <h6>18-18-18</h6>
          </div>

          <div className="badge badge-left">
            <span>YIELD</span>
            <h6>+42%</h6>
          </div>

          <div className="badge badge-bottom">
            <span>CERTIFIED</span>
            <h6>ISO 9001</h6>
          </div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;