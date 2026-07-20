import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./DashboardLayout.css";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        closeSidebar={() => setMobileOpen(false)}
      />

      <div className="content">
        <Navbar
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;