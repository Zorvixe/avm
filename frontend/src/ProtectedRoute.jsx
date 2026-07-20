import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function ProtectedRoute() {
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <>
      <Navbar />

      <main className={isHome ? "" : "page-content"}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default ProtectedRoute;