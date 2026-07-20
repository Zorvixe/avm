import "./Contact.css";
import {
  MapPin,
  Phone,
  Mail,
  TrendingUp,
} from "lucide-react";

function Contact() {
  return (
    <section className="contact-section">

      <div className="contact-container">

        {/* LEFT SIDE */}
        <div className="contact-left">

          <span className="contact-tag">
            GET IN TOUCH
          </span>

          <h1 className="contact-title">
            Let's grow <span>something</span>
            <br />
            extraordinary.
          </h1>

          <p className="contact-description">
            Our agronomists reply within 24 hours.
            For dealer applications, please note
            your region and current portfolio.
          </p>

          <div className="contact-divider"></div>

          <div className="contact-info">

            <div className="info-item">

              <div className="info-icon">
                <MapPin size={24} />
              </div>

              <div>
                <span>HEAD OFFICE</span>

                <h4>
                  TerraVita Tower,
                  MG Road,
                  Bengaluru 560001,
                  India
                </h4>
              </div>

            </div>

            <div className="info-item">

              <div className="info-icon">
                <Phone size={24} />
              </div>

              <div>
                <span>PHONE</span>

                <h4>
                  +91 80 4123 8000
                </h4>
              </div>

            </div>

            <div className="info-item">

              <div className="info-icon">
                <Mail size={24} />
              </div>

              <div>
                <span>EMAIL</span>

                <h4>
                  hello@terravita.com
                </h4>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="contact-right">

          <form className="contact-form">

            <div className="form-row">

              <div className="form-group">

                <label>
                  FULL NAME
                </label>

                <input
                  type="text"
                  placeholder="Enter Your Name"
                />

              </div>

              <div className="form-group">

                <label>
                  PHONE
                </label>

                <input
                  type="text"
                  placeholder="+91 98xxxx xxxxx"
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                EMAIL
              </label>

              <input
                type="email"
                placeholder="you@example.com"
              />

            </div>

            <div className="form-group">

              <label>
                CROP / INTEREST
              </label>

              <input
                type="text"
                placeholder="Wheat • 40 hectares"
              />

            </div>

            <div className="form-group">

              <label>
                MESSAGE
              </label>

              <textarea
                rows="6"
                placeholder="Tell us about your farm and goals..."
              ></textarea>

            </div>

            <button
              type="submit"
              className="contact-btn"
            >
              SEND MESSAGE
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Contact;