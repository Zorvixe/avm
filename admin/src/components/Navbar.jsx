import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import "./Navbar.css";

export default function Navbar({ onToggleSidebar, onOpenMobile }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-btn desktop-menu"
          onClick={onToggleSidebar}
        >
          <Menu size={22} />
        </button>

        <button
          className="menu-btn mobile-menu"
          onClick={onOpenMobile}
        >
          <Menu size={22} />
        </button>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products, orders..."
          />
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge red">3</span>
        </button>

        <button className="icon-btn">
          <MessageSquare size={20} />
          <span className="badge green">5</span>
        </button>

        <div className="profile" ref={menuRef}>
          <button
            className="profile-btn"
            onClick={() => setOpen(!open)}
          >
            <div className="avatar">AK</div>

            <div className="user-info">
              <h4>Anita Kapoor</h4>
              <p>Administrator</p>
            </div>

            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="dropdown">
              <button onClick={() => navigate("/profile")}>
                <UserCircle size={18} />
                Profile
              </button>

              <button onClick={() => navigate("/settings")}>
                <Settings size={18} />
                Settings
              </button>

              <hr />

              <button
                className="logout"
                onClick={logout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}