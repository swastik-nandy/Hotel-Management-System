import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaGem } from "react-icons/fa";
import { GiDiamondTrophy, GiScrollUnfurled } from "react-icons/gi";

const cards = [
  {
    title: "Standard Stay",
    image: "/images/room-deluxe.jpg",
    roomType: "STANDARD",
    price: "₹7,999/night",
    defaultBranchName: "Mumbai",
    description:
      "A timeless blend of comfort and calm, ideal for solo travelers or business guests.",
  },
  {
    title: "Luxury Suite",
    image: "/images/room-suite.jpg",
    roomType: "LUXURY",
    price: "₹14,999/night",
    defaultBranchName: "Kolkata",
    description:
      "Step into royal indulgence with spacious interiors, personalized service, and unmatched elegance.",
  },
  {
    title: "Deluxe Room",
    image: "/images/room-twin.webp",
    roomType: "DELUXE",
    price: "₹9,499/night",
    defaultBranchName: "Kolkata",
    description:
      "Where modern elegance meets warmth — perfect for a refined couple’s getaway.",
  },
];

export default function RoomsPreviewSection() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  const handleClick = () => navigate("/filter");

  return (
    <section
      id="explore"
      className="relative px-6 md:px-12 pt-10 pb-32 overflow-hidden bg-gradient-to-b from-[#fefcf7] to-[#e8d3bb]"
    >
      {/* Floating Icons */}
      <div className="absolute z-0 inset-0 pointer-events-none">
        <FaGem className="absolute top-10 left-10 text-yellow-400 text-3xl animate-ping opacity-10" />
        <GiDiamondTrophy className="absolute top-[65%] left-[70%] text-yellow-300 text-2xl animate-bounce opacity-20" />
        <GiScrollUnfurled className="absolute top-[40%] left-[15%] text-yellow-200 text-3xl animate-spin-slow opacity-10" />
      </div>

      {/* Heading */}
      <div className="text-center relative z-10" data-aos="fade-up">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#5a4234] to-transparent" />
          <div
            className="mx-4 text-3xl text-[#5a4234] drop-shadow-sm"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            ✦
          </div>
          <div className="w-24 h-px bg-gradient-to-l from-transparent via-[#5a4234] to-transparent" />
        </div>

        <h2
  className="text-3xl md:text-5xl text-black text-center"
  style={{
    fontFamily: "'Cinzel', serif",
    fontWeight: "500",
    marginBottom: "0.6rem",
    lineHeight: "1.2",
    wordSpacing: "0.1em", // This increases spacing between words
  }}
>
  Expore Our Rooms
</h2>
        <p
          className="text-base md:text-lg text-gray-700 italic mt-3 mb-12 shimmer max-w-xl mx-auto"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Comfort, elegance, and timeless design await in every stay.
        </p>
      </div>

      {/* Room Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 150}
            onClick={handleClick}
            className="group relative cursor-pointer rounded-[1.6rem] overflow-hidden 
              border border-[#d6c1a3] bg-[#3a2e2af0] backdrop-blur-sm 
              shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_0_30px_rgba(0,0,0,0.4)] 
              transition duration-500 hover:scale-[1.03]"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 space-y-2 text-white">
              <h3
                className="text-3xl md:text-4xl text-white"
                style={{
                  fontFamily: "'Allura', cursive",
                  fontWeight: "400",
                  lineHeight: "1.2",
                }}
              >
                {card.title}
              </h3>
              <p
                className="text-xs uppercase tracking-widest text-gray-300"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {card.roomType} · {card.defaultBranchName}
              </p>
              <p
                className="text-sm text-gray-200"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {card.description}
              </p>
              <p
                className="pt-2 text-sm font-semibold text-yellow-400"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Starting at {card.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-20" data-aos="fade-up">
        <button
          onClick={handleClick}
          className="px-8 py-3 border-2 border-[#3a2e2a] text-[#3a2e2a] rounded-full uppercase tracking-widest hover:bg-[#3a2e2a] hover:text-white transition duration-300"
          style={{ fontWeight: "600" }}
        >
          View All Rooms
        </button>
      </div>
    </section>
  );
}
