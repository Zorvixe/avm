import "./Footer.css";
import { Link } from "react-router-dom";

import {
  Leaf,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        {/* Company */}

        <div className="footer-column">

          <div className="footer-logo">
            <Leaf size={34} />
            <h2>TerraVita</h2>
          </div>

          <p>
            Empowering farmers with innovative crop nutrition
            and sustainable fertilizer solutions for healthier
            soil and higher yields.
          </p>

          <div className="footer-social">

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

            <a
              href="https://wa.me/918041238000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>

          </div>

        </div>

        {/* Quick Links */}

        <div className="footer-column">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact</Link>

        </div>

        {/* Products */}

        <div className="footer-column">

          <h3>Products</h3>

          <Link to="/products">NPK Fertilizers</Link>
          <Link to="/products">Organic Fertilizers</Link>
          <Link to="/products">Micronutrients</Link>
          <Link to="/products">Water Soluble Fertilizers</Link>

        </div>

        {/* Contact */}

        <div className="footer-column">

          <h3>Contact Us</h3>

          <a
            href="https://maps.google.com/?q=MG+Road+Bengaluru+Karnataka+560001"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact"
          >
            <MapPin size={18} />
            <span>
              MG Road,
              Bengaluru,
              Karnataka 560001
            </span>
          </a>

          <a
            href="tel:+918041238000"
            className="footer-contact"
          >
            <Phone size={18} />
            <span>+91 80 4123 8000</span>
          </a>

          <a
            href="mailto:hello@terravita.com"
            className="footer-contact"
          >
            <Mail size={18} />
            <span>hello@terravita.com</span>
          </a>

        </div>

      </div>

      <div className="footer-bottom">

        <p>© 2026 TerraVita. All Rights Reserved.</p>

        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

      </div>

    </footer>
  );
}

export default Footer;