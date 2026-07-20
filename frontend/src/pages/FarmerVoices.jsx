import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import "./FarmerVoices.css";

import farmer1 from "../assets/farmer-1.jpg";
import farmer2 from  "../assets/farmer-2.jpg";
import farmer3 from  "../assets/farmer-3.jpg";
import farmer4 from "../assets/about-soil.jpg";
import farmer5 from  "../assets/gallery-1.jpg";
import farmer6 from  "../assets/gallery-2.jpg";
const testimonials = [
  {
    image: farmer1,
    name: "Meera Prasad",
    location: "West Bengal, India",
    farm: "45 Hectares",
    review:
      "Aureum Yield transformed our rice quality. Grain weight, uniformity and market price all improved. It pays for itself many times over.",
  },
  {
    image: farmer2,
    name: "Ravi Kumar",
    location: "Andhra Pradesh",
    farm: "32 Hectares",
    review:
      "Our crop yield increased noticeably after switching. The fertilizer releases nutrients gradually and the soil stays healthier.",
  },
  {
    image: farmer4,
    name: "Anitha Reddy",
    location: "Telangana",
    farm: "18 Hectares",
    review:
      "Excellent product with consistent results every season. Plants remain greener and healthier while reducing fertilizer waste.",
  },
  {
    image: farmer5,
    name: "Anitha Reddy",
    location: "Telangana",
    farm: "18 Hectares",
    review:
      "Excellent product with consistent results every season. Plants remain greener and healthier while reducing fertilizer waste.",
  },
  {
    image: farmer6,
    name: "Anitha Reddy",
    location: "Telangana",
    farm: "18 Hectares",
    review:
      "Excellent product with consistent results every season. Plants remain greener and healthier while reducing fertilizer waste.",
  },
  {
    image: farmer3,
    name: "Anitha Reddy",
    location: "Telangana",
    farm: "18 Hectares",
    review:
      "Excellent product with consistent results every season. Plants remain greener and healthier while reducing fertilizer waste.",
  },
];

export default function FarmerVoices() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActive((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const item = testimonials[active];

  return (
    <section className="farmerVoiceSection">

      <div className="farmerVoiceHeading">

        <span className="voiceLabel">
          VOICES FROM THE FIELD
        </span>

        <h2>
          Trusted where <span>yield matters.</span>
        </h2>

      </div>

      <div className="farmerVoiceWrapper">

        <div className="farmerImageArea">

          <div className="farmerGlow"></div>

          <img
            src={item.image}
            alt={item.name}
            className="farmerPhoto"
          />

        </div>

        <div className="farmerContent">

          <Quote className="quoteIcon" size={30} />

          <p className="reviewText">
            "{item.review}"
          </p>

          <div className="reviewAuthor">

            <h3>{item.name}</h3>

            <p>
              {item.location} • {item.farm}
            </p>

          </div>

          <div className="testimonialNavigation">

            {/* <button onClick={prevSlide}>
              <ChevronLeft size={20} />
            </button> */}

            <div className="testimonialDots">

              {testimonials.map((_, index) => (
                <span
                  key={index}
                  className={
                    active === index
                      ? "voiceDot activeDot"
                      : "voiceDot"
                  }
                  onClick={() => setActive(index)}
                />
              ))}

            </div>

            {/* <button onClick={nextSlide}>
              <ChevronRight size={20} />
            </button> */}

          </div>

        </div>

      </div>

    </section>
  );
}