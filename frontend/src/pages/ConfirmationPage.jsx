import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axiosInstance";
import {
  CheckCircle,
  ReceiptText,
  ShieldCheck,
  Clock,
  PhoneCall,
  Sparkles,
  Loader,
  Stars,
  Wand2,
  BadgeCheck,
  Landmark,
  UserCheck,
  Wallet,
  CalendarCheck,
  BookOpen,
  ShieldHalf,
  CircleDollarSign,
  Hotel,
  AirVent,
  Lightbulb,
  BedDouble,
  FlameKindling,
  Users2
} from "lucide-react";

export default function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let bookingId = state?.bookingId;
    if (bookingId) {
      sessionStorage.setItem("latestBookingId", bookingId);
    } else {
      const stored = sessionStorage.getItem("latestBookingId");
      bookingId = stored && stored !== "undefined" ? stored : null;
    }

    if (!bookingId) {
      setError("Invalid confirmation access. Redirecting...");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    api
      .get(`/api/booking-status?bookingId=${bookingId}`)
      .then((res) => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Axios error:", err.response || err.message);
        setError("Failed to load booking details.");
        setLoading(false);
      });
  }, [state, navigate]);

  const downloadInvoice = async () => {
    setDownloading(true);
    try {
      const bookingId = booking?.bookingId;
      const res = await api.get(`/api/booking/${bookingId}/receipt`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${bookingId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error downloading invoice:", err);
      alert("Failed to download PDF receipt.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white text-xl overflow-hidden gap-4 animate-pulse">
        <Loader className="animate-spin" /> Loading confirmation...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-950 text-red-400 text-xl overflow-hidden">
        {error}
      </div>
    );

  return (
    <div className="w-screen overflow-x-hidden">
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-[#0a0a0c] via-[#111117] to-[#1a1a20] text-white font-sans relative overflow-x-hidden">
        {/* Floating Effects */}
        <div className="absolute top-[-200px] left-[-100px] w-[700px] h-[700px] bg-emerald-500 opacity-10 blur-[180px] rounded-full" />
        

        {/* Main Content */}
        <main className="flex-grow flex flex-col justify-center items-center pt-24 pb-16 px-6 md:px-16 relative z-10 w-full overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <div className="inline-flex items-center gap-3 text-black font-bold px-6 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-md text-lg">
              <CheckCircle size={20} /> Booking Confirmed
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-8 tracking-tight bg-gradient-to-r from-white via-emerald-200 to-teal-100 bg-clip-text text-transparent">
              Welcome to Your Stay, {booking?.customerName}!
            </h1>
            <p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-base sm:text-lg text-center">
              Your reservation is secured. We're prepping your room and polishing the pillows.
            </p>
          </motion.div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-6 mt-12 text-sm sm:text-base text-neutral-300 max-w-5xl w-full px-4">
            <Highlight icon={<Sparkles />} label="Room Type" value={booking?.roomType} />
            <Highlight icon={<Clock />} label="Stay Duration" value={`${booking?.checkIn} → ${booking?.checkOut}`} />
            <Highlight icon={<ReceiptText />} label="Booking ID" value={booking?.bookingId} />
          </div>

          {/* Download Button & Trust Info */}
          <div className="mt-14 flex flex-col items-center gap-4 w-full overflow-x-hidden px-4">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={downloadInvoice}
              disabled={downloading}
              className={`px-10 py-4 rounded-full font-bold text-white text-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 transition shadow-xl ${
                downloading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {downloading ? "Downloading..." : "Download Invoice"}
            </motion.button>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs text-neutral-500 mt-6 max-w-6xl w-full overflow-hidden break-words justify-items-center sm:justify-items-start">
              <TrustRow icon={<ShieldCheck size={14} />} text="Fully encrypted. Secured by SSL." />
              <TrustRow icon={<PhoneCall size={14} />} text="Need Help? Concierge: +91-999-000-1234" />
              <TrustRow icon={<Stars size={14} />} text="Earn LuxePoints with every stay." />
              <TrustRow icon={<Wand2 size={14} />} text="Curated experience tailored for you." />
              <TrustRow icon={<BadgeCheck size={14} />} text="Best Rate Guarantee by HotelVerse." />
              <TrustRow icon={<Landmark size={14} />} text="200+ branches globally." />
              <TrustRow icon={<UserCheck size={14} />} text="Verified bookings only." />
              <TrustRow icon={<Wallet size={14} />} text="Pay later options available." />
              <TrustRow icon={<CalendarCheck size={14} />} text="Flexible cancellation up to 24h." />
              <TrustRow icon={<BookOpen size={14} />} text="e-Guide for local experiences." />
              <TrustRow icon={<ShieldHalf size={14} />} text="24x7 safety monitoring." />
              <TrustRow icon={<CircleDollarSign size={14} />} text="No hidden charges ever." />
              <TrustRow icon={<Hotel size={14} />} text="All properties verified by team." />
              <TrustRow icon={<AirVent size={14} />} text="Fresh air certified rooms." />
              <TrustRow icon={<Lightbulb size={14} />} text="Energy-efficient eco lights." />
              <TrustRow icon={<BedDouble size={14} />} text="Premium bedding with linen service." />
              <TrustRow icon={<FlameKindling size={14} />} text="Fire-safe compliance enabled." />
              <TrustRow icon={<Users2 size={14} />} text="Group discounts available." />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black text-gray-500 text-xs sm:text-sm border-t border-white/5 py-14 mt-auto w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 sm:px-10">
            <div>
              <h3 className="text-white font-semibold mb-2 text-center sm:text-left">Company</h3>
              <ul className="space-y-1 text-center sm:text-left">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2 text-center sm:text-left">Support</h3>
              <ul className="space-y-1 text-center sm:text-left">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Cancellation Policy</a></li>
                <li><a href="#" className="hover:text-white transition">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2 text-center sm:text-left">Legal</h3>
              <ul className="space-y-1 text-center sm:text-left">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Preferences</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2 text-center sm:text-left">Connect</h3>
              <ul className="space-y-1 text-center sm:text-left">
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-600 mt-10">&copy; 2025 HotelVerse. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
}

function Highlight({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-emerald-400 mb-2">{icon}</div>
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

function TrustRow({ icon, text }) {
  return (
    <div className="flex items-center gap-2 justify-center sm:justify-start whitespace-normal break-words text-center sm:text-left">
      {icon}
      <span>{text}</span>
    </div>
  );
}
