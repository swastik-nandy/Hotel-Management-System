import React from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const getImageForType = (type) => {
  const lower = type?.toLowerCase();
  if (lower.includes("luxury")) return "/images/room-suite.jpg";
  if (lower.includes("deluxe")) return "/images/room-deluxe.jpg";
  if (lower.includes("standard") || lower.includes("twin")) return "/images/room-twin.webp";
  return "/images/default-room.jpg";
};

export default function InformationPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "Room";
  const branch = searchParams.get("branch") || "Branch";
  const branchId = searchParams.get("branchId");

  const imageUrl = getImageForType(type);

  return (
    <section className="min-h-screen bg-[#f7f7f7] px-6 md:px-12 py-20 text-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={`${type} Room`}
          className="w-full h-[400px] object-cover"
        />

        <div className="p-8 space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            {type} Room · {branch}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-600 text-lg leading-relaxed"
          >
            Our {type.toLowerCase()} rooms in {branch} offer a perfect balance of comfort and luxury.
            Whether you're here for business or leisure, this room provides everything you need for a
            relaxing stay — spacious layout, stylish interiors, and modern amenities tailored for your needs.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="list-disc pl-5 text-gray-700 space-y-2"
          >
            <li>High-speed Wi-Fi & Smart TV</li>
            <li>Air conditioning and blackout curtains</li>
            <li>24/7 room service and in-house dining</li>
            <li>Located in the heart of {branch}</li>
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
