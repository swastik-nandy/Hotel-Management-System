import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaGooglePay, FaCreditCard, FaUniversity } from "react-icons/fa";
import { SiUpwork, SiPaytm } from "react-icons/si";
import api from "../api/axiosInstance";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("UPI");

  const paymentMethods = [
    { name: "UPI", icon: <SiUpwork size={28} /> },
    { name: "Google Pay", icon: <FaGooglePay size={28} /> },
    { name: "Credit Card", icon: <FaCreditCard size={28} /> },
    { name: "Net Banking", icon: <FaUniversity size={26} /> },
    { name: "Paytm", icon: <SiPaytm size={28} /> },
  ];

  const getNightCount = () => {
    try {
      const checkIn = new Date(state.checkIn);
      const checkOut = new Date(state.checkOut);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 1;
    }
  };

  const getPricePerNight = () => {
    const nights = getNightCount();
    return nights > 0 ? Math.round(state.price / nights) : state.price;
  };

  useEffect(() => {
    if (!state || !state.customerName || !state.phoneNumber || !state.email) {
      setError("Missing booking or user information. Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [state, navigate]);

  const handlePayment = async () => {
    setProcessing(true);
    setError("");

    try {
      const payload = {
        customerName: state.customerName,
        phoneNumber: state.phoneNumber,
        email: state.email,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        bookingTime: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      };

      const finalPayload = {
        ...payload,
        branchId: state.branchId,
        roomType: state.roomType.charAt(0).toUpperCase() + state.roomType.slice(1),
      };

      const res = await api.post("/api/booking/add", finalPayload);

      const bookingId = res.data?.bookingId;
      if (!bookingId) throw new Error("Booking ID missing in response.");

      sessionStorage.setItem("latestBookingId", bookingId);
      navigate("/confirmation", { state: { bookingId } });
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      setError("Payment failed or booking could not be completed.");
      setProcessing(false);
    }
  };

  if (!state) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-gray-950 text-white">
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background gradient blur balls */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gray-600 opacity-10 blur-[180px] rounded-full z-0" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-gray-700 opacity-10 blur-[160px] rounded-full z-0" />

        <div className="relative z-10 w-full max-w-6xl bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 sm:p-10 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-10">Finalize Your Payment</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">
                Booking Summary
              </h3>
              <p><span className="font-medium text-gray-300">Name:</span> {state.customerName}</p>
              <p><span className="font-medium text-gray-300">Email:</span> {state.email}</p>
              <p><span className="font-medium text-gray-300">Phone:</span> {state.phoneNumber}</p>
              <p><span className="font-medium text-gray-300">Room Type:</span> {state.roomType}</p>
              <p><span className="font-medium text-gray-300">Branch:</span> #{state.branchId}</p>
              <p><span className="font-medium text-gray-300">Check-in:</span> {state.checkIn}</p>
              <p><span className="font-medium text-gray-300">Check-out:</span> {state.checkOut}</p>

              <div className="mt-3 border-t border-gray-700 pt-3 space-y-1">
                <p className="text-gray-400 text-sm">
                  ₹{getPricePerNight().toLocaleString("en-IN")} per night × {getNightCount()} night(s)
                </p>
                <p className="text-gray-300 font-medium text-lg">
                  Total Price : ₹{state.price?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
              <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">
                Select Payment Method
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    onClick={() => setSelectedMethod(method.name)}
                    className={`cursor-pointer flex items-center justify-center flex-col gap-2 p-4 rounded-xl border transition ${
                      selectedMethod === method.name
                        ? "border-emerald-400 bg-gray-700 shadow-md"
                        : "border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <div>{method.icon}</div>
                    <span className="text-sm">{method.name}</span>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <p className="text-gray-400 text-sm mb-1">Amount Payable</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ₹{state.price?.toLocaleString("en-IN")}
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full mt-4 py-3 rounded-full font-semibold transition duration-300 ${
                  processing
                    ? "bg-emerald-700 opacity-60 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-black shadow-md"
                }`}
              >
                {processing ? "Processing..." : `Pay with ${selectedMethod}`}
              </button>

              {error && <p className="text-center text-red-400 mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-black text-white text-center py-4 text-sm mt-auto">
        &copy; {new Date().getFullYear()} YourHotelName. All rights reserved.
      </footer>
    </div>
  );
}
