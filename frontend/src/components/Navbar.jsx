import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white text-black shadow-md" : "bg-black/40 text-white"
      } font-sans text-base tracking-wide px-6 py-2`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-y-2">
        {/* Brand */}
        <div
          className="text-3xl font-semibold tracking-widest pt-1 leading-[1.1]"
          style={{ fontFamily: "Allura, cursive" }}
        >
          Luxe Hotels
        </div>

        {/* Tabs + Button */}
        <div className="w-full sm:w-auto flex items-center gap-x-4 px-2">
          {/* Horizontal Scrollable Tabs */}
          <div className="max-w-[80vw] sm:max-w-none overflow-x-auto whitespace-nowrap scrollbar-hide">
            <ul className="flex gap-x-6 uppercase font-semibold text-[15px]">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Dining", path: "/dining" },
                { name: "Gallery", path: "/gallery" },
                { name: "Offers", path: "/offers" },
              ].map(({ name, path }) => (
                <li
                  key={name}
                  className="cursor-pointer hover:text-yellow-600 transition py-1"
                >
                  <RouterLink to={path}>{name}</RouterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Book Now Button */}
          <RouterLink
            to="/filter"
            className={`shrink-0 px-4 py-[6px] border-2 rounded-full text-sm font-medium transition duration-300 ${
              scrolled
                ? "bg-white text-[#5a4234] border-[#5a4234] hover:bg-[#5a4234] hover:text-white"
                : "bg-transparent text-[#5a4234] border-[#5a4234] hover:bg-[#5a4234] hover:text-white"
            }`}
          >
            Book Now
          </RouterLink>
        </div>
      </div>
    </nav>
  );
}
