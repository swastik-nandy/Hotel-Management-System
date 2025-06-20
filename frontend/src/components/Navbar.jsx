import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "DINING", path: "/dining" },
    { name: "GALLERY", path: "/gallery" },
    { name: "OFFERS", path: "/offers" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md backdrop-blur-md" : "bg-black/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
        {/* Brand */}
        <RouterLink
          to="/"
          className={`text-2xl font-bold tracking-wider ${
            scrolled ? "text-[#3a2e2a]" : "text-white"
          }`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Luxe Hotels
        </RouterLink>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-x-6 text-sm md:text-base tracking-wide font-medium">
            {navItems.map(({ name, path }) => (
              <li key={name}>
                <RouterLink
                  to={path}
                  className={`relative pb-1 transition duration-300 ${
                    location.pathname === path
                      ? "text-yellow-500"
                      : scrolled
                      ? "text-[#3a2e2a]"
                      : "text-white"
                  } hover:text-yellow-500`}
                >
                  {name}
                </RouterLink>
              </li>
            ))}
          </ul>

          {/* Book Now button */}
          <RouterLink
            to="/filter"
            className={`px-4 py-2 border-2 rounded-full text-sm font-semibold uppercase tracking-wide transition duration-300 ${
              scrolled
                ? "text-[#5a4234] border-[#5a4234] hover:bg-[#5a4234] hover:text-white"
                : "text-white border-white hover:bg-white hover:text-black"
            }`}
          >
            Book Now
          </RouterLink>

          {/* Mobile Menu Toggle */}
          <div
            className={`md:hidden text-2xl ml-2 transition-colors duration-300 ${
              scrolled ? "text-[#3a2e2a]" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white text-[#3a2e2a] px-6 pt-4 pb-6 space-y-4 shadow-md">
          {navItems.map(({ name, path }) => (
            <RouterLink
              key={name}
              to={path}
              className="block text-base font-semibold tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </RouterLink>
          ))}
        </div>
      )}
    </nav>
  );
}
