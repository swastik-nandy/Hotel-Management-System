import React, { useEffect } from "react";
import AOS from "aos";

export default function Dining() {
  useEffect(() => {
    AOS.init({ once: true, duration: 1200 });
  }, []);

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 bg-gradient-to-b from-[#fffaf5] to-[#f5efe7] text-[#5a4234] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/dining-texture.png')] opacity-10 bg-cover bg-center mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff9f3]/60 to-[#eadcd0]/50 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Main Heading */}
        <h1
          className="text-5xl md:text-6xl tracking-wider font-[Cinzel] mb-3 drop-shadow-xl"
          data-aos="fade-down"
        >
          Dining at <span className="text-[#a0765b] font-[Alex Brush]">Luxe</span>
        </h1>
        <p
          className="text-xl md:text-2xl italic mb-10 text-[#7b5c47] font-[Great Vibes]"
          data-aos="fade-up"
        >
          Savor every bite. Celebrate every flavor.
        </p>

        {/* Intro Glass Block */}
        <div
          className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-2xl shadow-[0_20px_40px_rgba(90,66,52,0.2)] border border-[#e0cfc3] text-[17px] font-[Cormorant Garamond] leading-[1.9] text-justify space-y-7 mb-20"
          data-aos="fade-up"
        >
          <p>
            <span className="text-4xl font-[Tangerine] leading-none float-left mr-3 text-[#a47c5f]">
              T
            </span>
            he Luxe culinary experience is a fusion of taste and tradition. Our chefs bring
            global expertise, fusing authenticity with creativity to offer an unforgettable
            gourmet journey. Each ingredient is selected with care — every dish, a signature
            moment.
          </p>
        </div>

        {/* Cuisine Categories */}
        <div className="mb-20" data-aos="fade-up">
          <h2 className="text-3xl font-[Cinzel] mb-6">Cuisines We Serve</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
            {[
              "Indian",
              "Continental",
              "Asian Fusion",
              "Mediterranean",
              "Vegan",
              "Gluten-Free",
              "Desserts",
              "Grill & Bar",
            ].map((cuisine, i) => (
              <div
                key={i}
                className="p-4 border border-[#c9b6a4] rounded-xl bg-white/70 backdrop-blur-lg shadow-md hover:shadow-xl transition duration-300 font-semibold text-lg hover:scale-[1.04]"
              >
                {cuisine}
              </div>
            ))}
          </div>
        </div>

        {/* Signature Dishes */}
        <div data-aos="fade-up">
          <h2 className="text-3xl font-[Cinzel] mb-6">Signature Dishes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Truffle Butter Risotto",
                description:
                  "Creamy Arborio rice with white truffle oil, wild mushrooms, and shaved parmesan.",
              },
              {
                title: "Royal Tandoori Platter",
                description:
                  "Succulent kebabs, paneer tikka, and saffron-marinated chicken served with mint chutney.",
              },
              {
                title: "Saffron Citrus Glazed Salmon",
                description:
                  "Grilled salmon with saffron-citrus glaze on a bed of herbed quinoa.",
              },
              {
                title: "Spiced Moroccan Lamb",
                description:
                  "Slow-roasted lamb with aromatic spices, apricots, and almond couscous.",
              },
              {
                title: "Classic French Crêpes",
                description:
                  "Delicate crêpes filled with vanilla cream, drizzled with raspberry coulis.",
              },
              {
                title: "Charcoal Smoked Mezze",
                description:
                  "Aromatic mezze selection with hummus, baba ganoush, and lavash crisps.",
              },
            ].map((dish, idx) => (
              <div
                key={idx}
                className="group bg-white/60 backdrop-blur-lg border border-[#dec8b6] p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition duration-300 text-left"
              >
                <h3 className="text-xl font-[Cinzel] mb-2 group-hover:text-[#a0765b] transition">
                  {dish.title}
                </h3>
                <p className="text-[16px] font-[Cormorant Garamond] text-[#5a4234]/90 leading-relaxed">
                  {dish.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
