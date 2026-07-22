import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Moon, Search, Sun, X, Leaf } from "lucide-react";
import "./Navbar.css";
import {
  User,
  LogOut,
  Package,
  ShoppingCart,
  TicketPercent,
} from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setOpen(false);

  navigate("/login");
};
useEffect(() => {
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const total = cart.reduce(
      (sum, item) => sum + Number(item.quantity || 1),
      0
    );

    setCartCount(total);
  };

  updateCartCount();

  window.addEventListener("cartUpdated", updateCartCount);
  window.addEventListener("storage", updateCartCount);

  return () => {
    window.removeEventListener("cartUpdated", updateCartCount);
    window.removeEventListener("storage", updateCartCount);
  };
}, []);

  useEffect(() => {
    const stored = localStorage.getItem("tv-theme");

    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggleTheme = () => {
    const next = !dark;

    setDark(next);

    document.documentElement.classList.toggle("dark", next);

    localStorage.setItem("tv-theme", next ? "dark" : "light");
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scroll" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-icon">
            <Leaf size={20} strokeWidth={1.5} />
            <span className="logo-ring"></span>
          </span>

          <span className="logo-text">
            <span>TerraVita</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/products" className="nav-link">
            Products
          </Link>

          <Link to="/about" className="nav-link">
            About
          </Link>

          <Link to="/contact" className="nav-link">
            Contact
          </Link>
         
        </nav>

        {/* Right Side */}
        <div className="nav-right">

  {/* Search */}
  <button className="circle-btn search-btn">
    <Search size={17} />
    
  </button>

  {/* Profile */}
  <div className="profile-menu">
    <button
      className="circle-btn"
      onClick={() => setProfileOpen(!profileOpen)}
    >
      <User size={18} />
    </button>

    {profileOpen && (
      <div className="profile-dropdown">
        <Link
          to="/profile"
          onClick={() => {
            setProfileOpen(false);
            setOpen(false);
          }}
        >
          <User size={16} />
          My Profile
        </Link>

        <Link
          to="/orders"
          onClick={() => {
            setProfileOpen(false);
            setOpen(false);
          }}
        >
          <Package size={16} />
          My Orders
        </Link>
         
         <Link
  to="/my-coupons"
  onClick={() => {
    setProfileOpen(false);
    setOpen(false);
  }}
>
  <TicketPercent size={16} />
  My Coupons
</Link>
        

        <button
          onClick={() => {
            setProfileOpen(false);
            handleLogout();
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    )}
  </div>

  {/* Cart */}
<Link
  to="/cart"
  className="nav-cart-btn"
  onClick={() => setOpen(false)}
>
  <ShoppingCart size={18} />

  {cartCount > 0 && (
    <span className="cart-count">
      {cartCount}
    </span>
  )}
</Link>

  {/* Menu */}
  <button
    className="menu-btn"
    onClick={() => setOpen(!open)}
  >
    {open ? <X size={18} /> : <Menu size={18} />}
  </button>

</div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link
            to="/products"
            onClick={() => setOpen(false)}
          >
            Products
          </Link>

          <Link
            to="/about"
            onClick={() => setOpen(false)}
          >
            AboutSection
          </Link>

          <Link
            to="/contact"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          
         
 

        </div>
      )}
    </header>
  );
}

export default Navbar;