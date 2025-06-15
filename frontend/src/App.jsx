import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

// Wrapper to use location
function AppWrapper() {
  const location = useLocation();

  // Detect refresh
  const isRefresh = performance.navigation.type === 1;

  // Block refresh-based access to these pages
  const blockedRoutes = ["/payment", "/confirmation"];
  const isBookingPage = location.pathname.startsWith("/book/");

  if (isRefresh && (blockedRoutes.includes(location.pathname) || isBookingPage)) {
    return null; // Let browser throw 404
  }

  // Show Navbar only on these paths
  const showNavbarPaths = ["/", "/about", "/dining", "/gallery", "/offers"];
  const showNavbar = showNavbarPaths.includes(location.pathname);

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
      </Routes>
    </>
  );
}

// Main App with Router
export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
