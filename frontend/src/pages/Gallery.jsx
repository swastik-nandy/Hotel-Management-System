import React, { useEffect } from "react";
import AOS from "aos";

export default function Gallery() {
  useEffect(() => {
    AOS.init({ once: true, duration: 1000 });
  }, []);

  const galleryImages = [
    { src: "/images/overview-room.avif", label: "Ocean View Suite" },
    { src: "/images/room-twin.webp", label: "Executive Twin Room" },
    { src: "/images/hotel.webp", label: "Poolside Villa" },
    { src: "/images/overview-dining.webp", label: "Fine Dining Pavilion" },
    { src: "/images/room-deluxe.jpg", label: "Deluxe Premium" },
    { src: "/images/overview-room.webp", label: "Sea Cliff Balcony Room" },
    { src: "/images/overview-lobby.jpg", label: "Luxury Lobby" },
    { src: "/images/room-suite.jpg", label: "Grand Heritage Suite" },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 bg-gradient-to-b from-[#fffaf5] to-[#f3eee8] text-[#5a4234] overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/dining-texture.png')] opacity-10 bg-cover bg-center mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff9f3]/60 to-[#eadcd0]/60 backdrop-blur-[1.5px]" />
      </div>

      {/* Page Title */}
      <div className="relative z-10 text-center max-w-6xl mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl font-[Cinzel] tracking-widest drop-shadow-lg" data-aos="fade-down">
          Luxe <span className="text-[#a0765b] font-[Alex Brush]">Gallery</span>
        </h1>
        <p
          className="text-xl md:text-2xl mt-3 italic text-[#7b5c47] font-[Great Vibes]"
          data-aos="fade-up"
        >
          Explore the art of living beautifully.
        </p>
      </div>

      {/* Image Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {galleryImages.map((img, index) => (
          <div
            key={index}
            className="group flex flex-col items-center transition duration-300 transform hover:scale-[1.03]"
            data-aos="fade-up"
          >
            {/* Image Box */}
            <div className="w-full h-64 overflow-hidden rounded-xl shadow-xl border border-[#e5d3c0]">
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Label Below - Allura Font */}
            <p className="mt-4 text-[22px] sm:text-[24px] text-center font-[Allura] text-[#5a4234] tracking-wide leading-snug group-hover:text-[#a0765b] transition duration-300">
              {img.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
