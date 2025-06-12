import React, { useEffect, useState } from "react";

const messages = [
  "Get 50% Off on Your First Booking...",
  "Indulge in World-Class Hospitality...",
  "Experience Sunshine Luxury Like Never Before",
];

export default function HeroSection() {
  const [displayedText, setDisplayedText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = messages[msgIndex];
    const speed = deleting ? 40 : 90;

    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayedText(current.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1300);
        }
      } else {
        setDisplayedText(current.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        if (charIndex === 0) {
          setDeleting(false);
          setMsgIndex((prev) => (prev + 1) % messages.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, msgIndex]);

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white px-6"
      style={{ backgroundImage: "url('/images/hotel.webp')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl w-full">
        {/* Scalable one-line heading on desktop */}
        <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4.25rem] font-stylish font-semibold tracking-wide leading-tight whitespace-normal md:whitespace-nowrap mb-6">
          Elevate Your Luxury Experience
        </h1>

        {/* Typewriter effect with stylish font */}
        <p className="text-xl md:text-2xl font-stylish text-yellow-100 min-h-[32px]">
          {displayedText}
          <span className="animate-pulse">|</span>
        </p>
      </div>
    </section>
  );
}
