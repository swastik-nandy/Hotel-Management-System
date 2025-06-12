import React, { useEffect } from "react";
import AOS from "aos";

export default function Offers() {
  useEffect(() => {
    AOS.init({ once: true, duration: 1000 });
  }, []);

  const offers = [
    {
      title: " 50% Off First Booking",
      description:
        "Enjoy half off on your first booking at Luxe Hotels. Valid for all deluxe and suite rooms.",
    },
    {
      title: " Complimentary Candlelight Dinner",
      description:
        "Reserve a premium suite and get a rooftop candlelight dinner for two on the house.",
    },
    {
      title: " Spa & Wellness Retreat",
      description:
        "Book 2 nights or more and enjoy a complimentary spa therapy session and detox drinks.",
    },
    {
      title: " Corporate Stay Package",
      description:
        "Get access to private lounges, fast WiFi, and meeting room discounts for corporate bookings.",
    },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 bg-gradient-to-b from-[#fffaf5] to-[#f3eee8] text-[#5a4234] overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/dining-texture.png')] opacity-10 bg-cover mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff9f3]/60 to-[#eadcd0]/50 backdrop-blur-[1.5px]" />
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center max-w-5xl mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl font-[Cinzel] tracking-widest drop-shadow-lg" data-aos="fade-down">
          Exclusive <span className="text-[#a0765b] font-[Allura]">Offers</span>
        </h1>
        <p
          className="text-xl md:text-2xl mt-3 italic text-[#7b5c47] font-[Great Vibes]"
          data-aos="fade-up"
        >
          Make your stay even more memorable.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="group bg-white/60 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl shadow-xl border border-[#e1cfc2] transition hover:shadow-2xl hover:scale-[1.02]"
            data-aos="fade-up"
          >
            <h2 className="text-2xl sm:text-3xl mb-3 font-[Cinzel] text-[#5a4234] group-hover:text-[#a0765b] transition">
              {offer.title}
            </h2>
            <p className="text-[17px] font-[Cormorant Garamond] text-[#5a4234]/90 leading-relaxed">
              {offer.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
