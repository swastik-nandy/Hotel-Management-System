import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axiosInstance";
import {
  CheckCircle, ReceiptText, ShieldCheck, Clock, PhoneCall, Sparkles,
  Loader, Stars, Wand2, BadgeCheck, Landmark, UserCheck, Wallet,
  CalendarCheck, BookOpen, ShieldHalf, CircleDollarSign
} from "lucide-react";

export default function ConfirmationPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setError("Invalid confirmation URL. Redirecting...");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    const confirmBooking = async () => {
      let attempts = 0;
      let success = false;

      while (attempts < 5 && !success) {
        try {
          const res = await api.get(`/api/booking/confirm?session_id=${sessionId}`);
          const bookingId = res.data.bookingId;
          sessionStorage.setItem("latestBookingId", bookingId);
          await fetchBookingDetails(bookingId);
          success = true;
        } catch (err) {
          attempts++;
          console.warn(`❌ Attempt ${attempts}: Booking not found`);
          if (attempts >= 5) {
            setError("Booking not found. Redirecting...");
            setTimeout(() => navigate("/"), 3000);
          } else {
            await new Promise(res => setTimeout(res, 1000)); // wait 1s
          }
        }
      }
    };

    const fetchBookingDetails = async (id) => {
      try {
        const res = await api.get(`/api/booking-status?bookingId=${id}`);
        setBooking(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching details:", err);
        setError("Could not fetch booking details.");
        setLoading(false);
      }
    };

    confirmBooking();
  }, [search, navigate]);

  const downloadInvoice = async () => {
    if (!booking?.bookingId) return;
    setDownloading(true);
    try {
      const res = await api.get(`/api/booking/${booking.bookingId}/receipt`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${booking.bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download invoice.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white text-xl gap-4 animate-pulse">
        <Loader className="animate-spin" /> Loading confirmation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-950 text-red-400 text-xl text-center px-4">
        {error}
      </div>
    );
  }

  return (
    <div className="w-screen overflow-x-hidden">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#111117] to-[#1a1a20] text-white font-sans">
        <main className="flex-grow flex flex-col justify-center items-center pt-24 pb-16 px-6 md:px-16">
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
            <p className="text-neutral-400 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
              Your reservation is secured. We’re prepping your room and polishing the pillows.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 mt-12 text-sm sm:text-base text-neutral-300 max-w-5xl w-full px-4">
            <Highlight icon={<Sparkles />} label="Room Type" value={booking?.roomType} />
            <Highlight icon={<Clock />} label="Stay Duration" value={`${booking?.checkIn} → ${booking?.checkOut}`} />
            <Highlight icon={<ReceiptText />} label="Booking ID" value={booking?.bookingId} />
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 w-full px-4">
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
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs text-neutral-500 mt-8 max-w-6xl w-full px-4">
            <TrustRow icon={<ShieldCheck size={14} />} text="Fully encrypted. Secured by SSL." />
            <TrustRow icon={<PhoneCall size={14} />} text="24/7 concierge support." />
            <TrustRow icon={<Stars size={14} />} text="Earn LuxePoints on every stay." />
            <TrustRow icon={<Wand2 size={14} />} text="Curated experience guaranteed." />
            <TrustRow icon={<BadgeCheck size={14} />} text="Best Rate Guarantee" />
            <TrustRow icon={<Landmark size={14} />} text="200+ branches globally" />
            <TrustRow icon={<UserCheck size={14} />} text="Verified bookings only" />
            <TrustRow icon={<Wallet size={14} />} text="Multiple payment options" />
            <TrustRow icon={<CalendarCheck size={14} />} text="Flexible cancellations" />
            <TrustRow icon={<BookOpen size={14} />} text="e-Guides for local tips" />
            <TrustRow icon={<ShieldHalf size={14} />} text="24x7 safety monitoring" />
            <TrustRow icon={<CircleDollarSign size={14} />} text="No hidden charges" />
          </div>
        </main>
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
    <div className="flex items-center gap-2 text-center sm:text-left">
      {icon}
      <span>{text}</span>
    </div>
  );
}
