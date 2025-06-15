import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import InformationPage from "./pages/InformationPage";
import FilterPage from "./pages/FilterPage";
import About from "./pages/About";
import Dining from "./pages/Dining";
import Gallery from "./pages/Gallery";
import Offers from "./pages/Offers";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound"; // ✅ Custom 404 page

function AppWrapper() {
  const location = useLocation();

  const showNavbarPaths = ["/", "/about", "/dining", "/gallery", "/offers"];
  const showNavbar = showNavbarPaths.includes(location.pathname);

  const blockedRoutes = ["/payment"];
  const isBookingPage = location.pathname.startsWith("/book/");

  // ✅ Use modern reliable refresh detection
  const navEntries = window.performance.getEntriesByType("navigation");
  const isRefresh = navEntries.length > 0 && navEntries[0].type === "reload";

  if (isRefresh && (blockedRoutes.includes(location.pathname) || isBookingPage)) {
    return <NotFound />; // ✅ Show your custom 404
  }

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book/:roomId" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/info" element={<InformationPage />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/dining" element={<Dining />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/offers" element={<Offers />} />
        
        {/* Default catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppWrapper />;
}
