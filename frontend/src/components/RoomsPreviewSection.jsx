import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Standard Stay",
    image: "/images/room-deluxe.jpg",
    roomType: "STANDARD",
    price: "₹7,999/night",
    defaultBranchId: 2,
    defaultBranchName: "Mumbai",
  },
  {
    title: "Luxury Suite",
    image: "/images/room-suite.jpg",
    roomType: "LUXURY",
    price: "₹14,999/night",
    defaultBranchId: 1,
    defaultBranchName: "Kolkata",
  },
  {
    title: "Deluxe Room",
    image: "/images/room-twin.webp",
    roomType: "DELUXE",
    price: "₹9,499/night",
    defaultBranchId: 1,
    defaultBranchName: "Kolkata",
  },
];

export default function RoomsPreviewSection() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/filter");
  };

  return (
    <section
      id="explore"
      className="px-6 md:px-12 py-20"
      style={{
        background: "linear-gradient(to bottom, #ffffff, #dfcbb2)", // white to soft brown
      }}
    >
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl text-center tracking-wide mb-12"
        style={{ fontFamily: "'Cinzel', serif", fontWeight: "bold" }}
      >
        Explore Our Rooms
      </motion.h2>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div
              onClick={handleClick}
              className="cursor-pointer block bg-[#3a2e2a] text-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-5">
                <h3
                  className="text-2xl mb-1"
                  style={{ fontFamily: "'Allura', cursive" }}
                >
                  {card.title}
                </h3>
                <p className="text-xs tracking-wide text-gray-300 mb-2">{card.roomType}</p>
                <p className="text-md font-semibold text-yellow-400">
                  Starting at {card.price}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
