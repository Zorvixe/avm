import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  UserCog,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
  Leaf,
  X,
} from "lucide-react";
import "./Sidebar.css";


const menu = [
  { path: "/", title: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/productslist", title: "Products List", icon: Package },
  { path: "/addproducts", title: "Add Products", icon: Package },
  { path: "/orders", title: "Orders", icon: ShoppingCart },
  { path: "/customers", title: "Customers", icon: Users },
  { path: "/settings", title: "Settings", icon: Settings },
  { path: "/profile", title: "Profile", icon: UserCircle },
];

function Sidebar({ collapsed, mobileOpen, closeSidebar }) {
  const navigate = useNavigate();

 const logout = () => {
  console.log("Logout clicked");

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  console.log("Token after logout:", localStorage.getItem("token"));

navigate("/login");
};

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "show" : ""
      }`}
    >
      <div className="logo">

        <div className="logo-icon">
          <Leaf size={22} />
        </div>

        {!collapsed && <h2>TerraVita</h2>}

        <button className="close-btn" onClick={closeSidebar}>
          <X size={20} />
        </button>

      </div>

      <nav className="menu">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => {
              if (window.innerWidth <= 992) {
                closeSidebar();
              }
            }}
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <item.icon size={20} />

            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}

      </nav>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}

export default Sidebar;