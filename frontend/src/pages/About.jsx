import React, { useEffect } from "react";
import AOS from "aos";

export default function About() {
  useEffect(() => {
    AOS.init({ once: true, duration: 1200 });
  }, []);

  return (
    <section className="relative min-h-screen pt-32 px-6 bg-gradient-to-b from-[#fefaf5] to-[#f1ebe3] text-[#5a4234] overflow-hidden">
      {/* Layered Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/luxury-texture.png')] opacity-10 bg-cover mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff9f3]/60 to-[#e9d7c8]/50 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h1
          className="text-5xl md:text-6xl tracking-wider font-[Cinzel] mb-3 drop-shadow-xl"
          data-aos="fade-down"
        >
          About <span className="text-[#a0765b] font-[Alex Brush]">Luxe Hotels</span>
        </h1>

        <p
          className="text-xl md:text-2xl italic mb-10 text-[#7b5c47] font-[Great Vibes]"
          data-aos="fade-up"
        >
          Crafted elegance, curated experiences.
        </p>

        {/* Fancy Glass Card */}
        <div
          className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-2xl shadow-[0_20px_40px_rgba(90,66,52,0.2)] border border-[#e0cfc3] text-[17px] font-[Cormorant Garamond] leading-[1.9] text-justify space-y-7"
          data-aos="fade-up"
        >
          <p>
            <span className="text-4xl font-[Tangerine] leading-none float-left mr-3 text-[#a47c5f]">
              A
            </span>
            t Luxe Hotels, we deliver more than just a stay — we offer an immersive experience.
            Our properties are designed to reflect timeless architecture, royal ambiance, and
            personalized service that makes every guest feel like royalty.
          </p>

          <p>
            Our commitment to hospitality is woven into every room, every hallway, and every
            dish. Whether it’s a sunrise breakfast in bed, an evening spa session, or the
            calming scent of sandalwood in the lobby — every moment here is intentional.
          </p>

          <p>
            Trusted by dignitaries, loved by artists, and adored by couples, Luxe Hotels is
            where the world’s finest meet their perfect escape.
          </p>

          <p className="text-center text-[18px] mt-6 font-[Clicker Script] text-[#5a4234]">
            “Luxury is when every detail counts, and every moment feels timeless.”
          </p>
        </div>
      </div>
    </section>
  );
}
