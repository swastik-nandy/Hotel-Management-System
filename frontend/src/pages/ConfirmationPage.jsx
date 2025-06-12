import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axiosInstance";
import { CheckCircle } from "lucide-react";

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
      <div className="flex justify-center items-center min-h-screen bg-black text-white text-xl overflow-hidden">
        Loading confirmation...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-950 text-red-400 text-xl overflow-hidden">
        {error}
      </div>
    );

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-gray-850 to-gray-950 text-white flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6 sm:p-10 overflow-hidden relative">
        {/* Background gradient orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gray-600 opacity-10 blur-[180px] rounded-full z-0"></div>
        <div className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-gray-700 opacity-10 blur-[160px] rounded-full z-0"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-gray-700 rounded-3xl shadow-xl p-6 sm:p-10"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="bg-green-500 text-black px-6 py-2 rounded-full shadow-md inline-flex items-center gap-2 font-semibold tracking-tight">
              <CheckCircle size={20} /> Booking Confirmed
            </div>
            <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-xl">
              Your reservation has been successfully made. See details below.
            </p>
          </div>

          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base text-gray-200">
            {/* Customer Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-2">Customer Info</h2>
              <p><strong>Name:</strong> {booking?.customerName}</p>
              <p><strong>Email:</strong> {booking?.email}</p>
              <p><strong>Phone:</strong> {booking?.phoneNumber}</p>
              <p><strong>Booking ID:</strong> {booking?.bookingId}</p>
            </div>

            {/* Booking Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-3">
              <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-2">Booking Details</h2>
              <p><strong>Branch:</strong> {booking?.branchName}</p>
              <p><strong>Room:</strong> #{booking?.roomNumber} ({booking?.roomType})</p>
              <p><strong>Check-in:</strong> {booking?.checkIn}</p>
              <p><strong>Check-out:</strong> {booking?.checkOut}</p>
              <p><strong>Price:</strong> ₹{booking?.price?.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-10 flex justify-center">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={downloadInvoice}
              disabled={downloading}
              className={`px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition duration-300 shadow-lg ${
                downloading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {downloading ? "Downloading..." : " Download Invoice (PDF)"}
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-500 text-sm py-6 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p>&copy; 2025 HotelVerse. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
