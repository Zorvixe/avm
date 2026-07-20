import "./AboutSection.css";
import { Link } from "react-router-dom";
import soilImage from "../assets/about-soil.jpg";
import processLab from "../assets/process-lab.jpg";
import aboutImage from "../assets/video.mp4";
import SplitButtonText from "../animations/SplitButtonText";
import {
  FlaskConical,
  Globe,
  ShieldCheck,
  Sprout,
} from "lucide-react";

function AboutSection({ fullPage = false }) {
  return (
    <>
      {/* HOME ABOUT SECTION */}
      {!fullPage && (
        <section className="about-section">
          <div className="about-left">
            <img
              src={soilImage}
              alt="Soil"
              className="about-image"
            />

            <div className="experience-card">
              <h2>27</h2>

              <p>
                YEARS PIONEERING
                <br />
                AGRI-SCIENCE
              </p>
            </div>
          </div>

          <div className="about-right">
            <span className="about-tag">
              ABOUT TERRAVITA
            </span>

            <h1 className="about-title">
              Where soil science
              <br />
              meets craft.
            </h1>

            <p className="about-text">
              Since 1998, TerraVita has quietly become the choice of the world's
              most demanding growers. Our formulations are the result of three
              decades of soil research, molecular chemistry, and hands-in-the-earth
              field trials.
            </p>

            <p className="about-text">
              We don't just feed the plant — we restore entire ecosystems, one
              hectare at a time. From smallholder farms in Punjab to industrial
              estates in Iowa, our products are trusted where yield is not
              negotiable.
            </p>

            <div className="features">

              <div className="feature">
                <div className="icon-box">
                  <FlaskConical size={22} />
                </div>

                <div>
                  <h4>R&D Excellence</h4>
                  <p>3 dedicated research campuses</p>
                </div>
              </div>

              <div className="feature">
                <div className="icon-box">
                  <Globe size={22} />
                </div>

                <div>
                  <h4>Global Reach</h4>
                  <p>24 countries</p>
                </div>
              </div>

              <div className="feature">
                <div className="icon-box">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h4>ISO Certified</h4>
                  <p>9001 • 14001 • 45001</p>
                </div>
              </div>

              <div className="feature">
                <div className="icon-box">
                  <Sprout size={22} />
                </div>

                <div>
                  <h4>Sustainable</h4>
                  <p>Carbon Neutral</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ABOUT PAGE */}
      {fullPage && (
        <>
          <section className="about-hero">

            <div className="about-overlay"></div>

            <div className="about-hero-content">

              <span>EST. 1998 • BENGALURU</span>

              <h1>
                Three decades of
                <br />
                <em>quiet mastery.</em>
              </h1>

              <p>
               What began as a single soil-testing lab in Bengaluru has grown into a globally trusted agri-science company — while never losing sight of the one thing that matters: the grower.
              </p>

            </div>

          </section>

          <section className="about-full-section">

            <div className="about-full-grid">
              <div>

                <h2>The Philosophy</h2>

                <p>
                  We believe fertilizer should never be a compromise. Every TerraVita formulation earns its place through molecular precision, field validation, and third-party audit. If it doesn't measurably improve yield and soil, it never leaves the lab. </p>

                <p>This discipline has produced 42 patents, 8 innovation awards, and partnerships with ICAR, IARI, and the world's leading agri-research institutes.</p>

              </div>
                <div>

                <img
                  src={soilImage}
                  className="about-full-image"
                  alt=""
                />

              </div>

            </div>

          </section>

          {/* <section className="research-section">

            <div className="research-grid">

              <div>

                <h2>Research at the Core</h2>

                <p>
                  140 scientists across three research campuses are developing
                  the next generation of fertilizers.
                </p>

                <div className="research-stats">

                  <div>
                    <h3>140</h3>
                    <span>Scientists</span>
                  </div>

                  <div>
                    <h3>3</h3>
                    <span>Campuses</span>
                  </div>

                  <div>
                    <h3>12%</h3>
                    <span>Revenue in R&amp;D</span>
                  </div>

                </div>

              </div>

              <div>

                <div className="story-photo-box">
              <video
                src={aboutImage}
                autoPlay
                muted
                loop
                playsInline
                className="story-video"
              />
            </div>

              </div>

            </div>

          </section> */}
            <section className="story-area">
          <div className="story-wrapper">

            <div className="story-photo-box">
              <video
                src={aboutImage}
                autoPlay
                muted
                loop
                playsInline
                className="story-video"
              />
            </div>

            <div className="story-info">


              <h2 className="story-heading">
                THE STORY BEHIND
                <br />
                <span>TERRAVITA</span>
              </h2>

              <p className="story-text">
                Founded in 1998, TerraVita began with a simple belief: healthy soil is
                the foundation of a sustainable future. What started as a small
                soil-research laboratory has grown into a globally trusted
                agri-science company, serving growers across more than 24 countries
                with advanced plant nutrition solutions.
              </p>

              <p className="story-text">
                Combining decades of scientific research with real-world farming
                experience, TerraVita develops premium fertilizers, micronutrients,
                bio-stimulants, and specialty crop nutrition products that improve
                soil fertility, maximize yields, and promote environmentally
                responsible agriculture. </p>
               <button
                className="split-btn"
                onClick={() => navigate("/products")}
              >
                <SplitButtonText
                  text="Explore Products"
                  delay={0.03}
                  duration={0.5}
                  ease="power3.out"
                />
              </button>
            </div>

          </div>
        </section>
        </>
      )}
    </>
  );
}

export default AboutSection;