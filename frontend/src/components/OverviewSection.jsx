import React from "react";

export default function OverviewSection() {
  return (
    <section
      id="overview"
      className="bg-white text-black px-6 md:px-14 py-16"
    >
      {/* Heading in luxury serif */}
      <div className="text-center mb-10">

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
  The Luxe Experience
</h2>



        <p
          className="mt-4 text-lg leading-relaxed max-w-3xl mx-auto"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          At Luxe Hotels, elegance meets excellence. Discover timeless hospitality rooted in
          heritage, surrounded by opulence and attention to every detail. From luxury rooms
          to curated dining and world-class wellness, each stay is an unforgettable journey.
        </p>
      </div>

      {/* Image gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="overflow-hidden rounded-xl shadow-md">
          <img
            src="/public/images/overview-lobby.jpg"
            alt="Taj Lobby"
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="overflow-hidden rounded-xl shadow-md">
          <img
            src="public/images/overview-room.webp"
            alt="Luxury Room"
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="overflow-hidden rounded-xl shadow-md">
          <img
            src="public/images/overview-dining.webp"
            alt="Taj Dining"
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
}
