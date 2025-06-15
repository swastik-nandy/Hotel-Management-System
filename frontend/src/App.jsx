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
import NotFound from "./pages/NotFound"; // Optional: app-level 404

function AppWrapper() {
  const location = useLocation();

  const showNavbarPaths = ["/", "/about", "/dining", "/gallery", "/offers"];
  const showNavbar = showNavbarPaths.includes(location.pathname);

  // Only block refresh for these routes
  const blockedRoutes = ["/payment"];
  const isBookingPage = location.pathname.startsWith("/book/");
  const isRefresh = performance.navigation.type === 1;

  if (isRefresh && (blockedRoutes.includes(location.pathname) || isBookingPage)) {
    window.location.href = "/__404_trigger__"; // ✅ True browser 404
    return null;
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppWrapper />;
}
