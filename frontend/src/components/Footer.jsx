import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#5a4234] text-white py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Luxe Hotels Brand */}
        <div>
          <h3
            className="text-3xl mb-4"
            style={{ fontFamily: "Allura, cursive" }}
          >
            Luxe Hotels
          </h3>
          <p className="leading-relaxed">
            A premium destination for luxurious stays, gourmet dining, and unforgettable experiences.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3 text-lg">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/dining" className="hover:underline">Dining</Link></li>
            <li><Link to="/gallery" className="hover:underline">Gallery</Link></li>
            <li><Link to="/offers" className="hover:underline">Offers</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-3 text-lg">Contact</h4>
          <p>Email: contact@luxehotels.com</p>
          <p>Phone: +91 1234567890</p>
          <p>Address: Luxe HQ, Mumbai, India</p>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold mb-3 text-lg">Follow Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-gray-300">
        &copy; {new Date().getFullYear()} Luxe Hotels. All rights reserved.
      </div>
    </footer>
  );
}
