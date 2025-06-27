import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import {
  FaShieldAlt, FaInfoCircle, FaLock, FaHeadset, FaGift, FaBolt
} from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!state || !state.customerName) {
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
        bookingTime: new Date().toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        branchId: state.branchId,
        roomType: state.roomType,
        ...(state.roomId && { roomId: state.roomId }),
      };

      const res = await api.post("/api/stripe/create-session", payload);
      const sessionId = res.data?.sessionId;
      if (!sessionId) throw new Error("No session ID returned.");

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Payment error:", err);
      setError("Something went wrong while starting payment. Please try again.");
      setProcessing(false);
    }
  };

  const applyPromo = () => {
    if (promo.toLowerCase() === "luxestay") {
      setDiscount(500);
    } else {
      setDiscount(0);
    }
  };

  if (!state) return null;

  const total = state.price + 250 + Math.floor(state.price * 0.18) - discount;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#131317] to-[#1c1c22] text-white font-sans">
      {processing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
          <p className="mt-4 text-lg px-4 text-center">
            Please wait, redirecting to secure checkout...
          </p>
        </div>
      )}

      <header className="px-6 md:px-16 lg:px-28 pt-12 pb-6 border-b border-white/10">
        <div className="text-sm text-neutral-400 mb-2">Step 2 of 3</div>
        <h1 className="text-4xl font-bold tracking-tight">Review & Confirm</h1>
        <p className="text-sm text-neutral-500 mt-2">
          You're almost there! Double-check your details below before continuing to payment.
        </p>
      </header>

      <div className="w-full bg-white/5 h-1">
        <div className="bg-emerald-400 h-1" style={{ width: "66%" }} />
      </div>

      <main className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6 md:px-16 lg:px-28 py-12">
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Booking Overview</h2>
          <div className="text-sm text-neutral-300 space-y-2">
            <Detail label="Name" value={state.customerName} />
            <Detail label="Email" value={state.email} />
            <Detail label="Room Type" value={state.roomType} />
            <Detail label="Branch" value={`#${state.branchId}`} />
            <Detail label="Check-in" value={state.checkIn} />
            <Detail label="Check-out" value={state.checkOut} />
            <Detail label="Guests" value="2 Adults" />
            <Detail label="Nights" value="2" />
          </div>

          <div className="bg-[#151518] border border-white/10 rounded-xl p-4 text-sm space-y-2 mt-6">
            <Breakdown label="Base Price" value={`₹${state.price?.toLocaleString("en-IN")}`} />
            <Breakdown label="Service Fee" value="₹250" />
            <Breakdown label="Taxes (18%)" value={`₹${Math.floor(state.price * 0.18)}`} />
            {discount > 0 && <Breakdown label="Promo Discount" value={`-₹${discount}`} />}
            <div className="flex justify-between items-center text-green-400 font-bold border-t border-white/10 pt-3">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-white block mb-2">Apply Promo Code</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Enter code"
                className="w-full py-2 px-3 rounded-md bg-neutral-800 text-white border border-neutral-700 placeholder-white/30 text-sm"
              />
              <button
                onClick={applyPromo}
                className="px-4 py-2 rounded-md text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium"
              >
                Apply
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Use <code>LUXESTAY</code> for ₹500 off.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-4 rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-black text-lg font-semibold shadow-lg transition"
          >
            Proceed to Secure Payment → ₹{total.toLocaleString("en-IN")}
          </button>
          {error && <p className="text-red-400 text-sm pt-2">{error}</p>}

          <div className="flex flex-col gap-3 text-xs text-neutral-500 mt-8">
            <Info icon={<FaShieldAlt />} text="256-bit SSL encryption ensures your data is protected" />
            <Info icon={<FaLock />} text="PCI-DSS compliant payment processing" />
            <Info icon={<FaInfoCircle />} text="Refunds available within 24 hours if booking fails" />
            <Info icon={<FaBolt />} text="Instant confirmation once payment is successful" />
            <Info icon={<FaGift />} text="Earn LuxePoints on every booking" />
            <Info icon={<FaHeadset />} text="Need Help? Chat with 24/7 support" />
          </div>
        </section>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-neutral-500">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function Breakdown({ label, value }) {
  return (
    <div className="flex justify-between items-center text-white/90">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Info({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
