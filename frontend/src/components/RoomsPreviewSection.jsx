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

  const handleClick = (roomType, branchId, branchName) => {
    navigate(
      `/info?branch=${encodeURIComponent(branchName)}&branchId=${branchId}&type=${roomType}`
    );
  };

  return (
    <section id="explore" className="bg-[#f7f7f7] text-black px-6 md:px-12 py-20">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wide mb-12"
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
              onClick={() =>
                handleClick(card.roomType, card.defaultBranchId, card.defaultBranchName)
              }
              className="cursor-pointer block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.015] transition-transform duration-300"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-1">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{card.roomType}</p>
                <p className="text-lg font-bold text-yellow-600">{card.price}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
