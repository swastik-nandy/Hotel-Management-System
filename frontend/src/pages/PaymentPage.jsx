import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  FaCcVisa,
  FaCcMastercard,
  FaGooglePay,
  FaUniversity,
  FaCcAmex,
  FaCcDiscover,
  FaShieldAlt,
  FaInfoCircle,
  FaLock,
  FaHeadset,
  FaGift,
  FaBolt
} from "react-icons/fa";
import { SiPhonepe, SiPaytm, SiRazorpay } from "react-icons/si";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("CARD");
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
    try {
      const payload = {
        customerName: state.customerName,
        phoneNumber: state.phoneNumber,
        email: state.email,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        bookingTime: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        branchId: state.branchId,
        roomType: state.roomType,
      };
      const res = await api.post("/api/booking/add", payload);
      const bookingId = res.data?.bookingId;
      if (!bookingId) throw new Error("Booking failed.");
      sessionStorage.setItem("latestBookingId", bookingId);
      navigate("/confirmation", { state: { bookingId } });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  const total = state.price + 250 + Math.floor(state.price * 0.18) - discount;

  const applyPromo = () => {
    if (promo.toLowerCase() === "luxestay") {
      setDiscount(500);
    } else {
      setDiscount(0);
    }
  };

  if (!state) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#131317] to-[#1c1c22] text-white font-sans">
      {/* Overlay spinner when processing */}
      {processing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
          <p className="mt-4 text-lg px-4 text-center">
            Please wait, your booking invoice is being generated...
          </p>
        </div>
      )}

      <header className="px-6 md:px-16 lg:px-28 pt-12 pb-6 border-b border-white/10">
        <div className="text-sm text-neutral-400 mb-2">Step 2 of 3</div>
        <h1 className="text-4xl font-bold tracking-tight">Secure Your Booking</h1>
        <p className="text-sm text-neutral-500 mt-2">
          You're just one step away from confirming your stay. We’ll hold this room for{' '}
          <span className="text-yellow-400 font-medium">10 minutes</span>.
        </p>
      </header>

      <div className="w-full bg-white/5 h-1">
        <div className="bg-emerald-400 h-1" style={{ width: "66%" }} />
      </div>

      <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 px-6 md:px-16 lg:px-28 py-12">
        <section className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">
            Booking Overview
          </h2>
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
            <Breakdown
              label="Base Price"
              value={`₹${state.price?.toLocaleString("en-IN")}`}
            />
            <Breakdown label="Service Fee" value="₹250" />
            <Breakdown
              label="Taxes (18%)"
              value={`₹${Math.floor(state.price * 0.18)}`}
            />
            {discount > 0 && <Breakdown label="Promo Discount" value={`-₹${discount}`} />}
            <div className="flex justify-between items-center text-green-400 font-bold border-t border-white/10 pt-3">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-white block mb-2">
              Apply Promo Code
            </label>
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

          <div className="mt-6 text-sm bg-yellow-500/10 border-l-4 border-yellow-500 px-4 py-3 text-yellow-300 rounded flex gap-2 items-start">
            <FaHeadset className="mt-1" />
            <div>
              <strong>Need Help?</strong>
              <br />
              Chat with us anytime via{' '}
              <a className="underline" href="#">
                24/7 support
              </a>
              .
            </div>
          </div>
        </section>

        <section className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
            <div className="flex flex-wrap gap-3">
              {['CARD', 'UPI', 'NET'].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`px-4 py-2 rounded-md text-sm font-medium border ${
                    selectedMethod === method
                      ? 'bg-white text-black'
                      : 'bg-neutral-800 text-white/70 border-white/10 hover:bg-neutral-700'
                  }`}>
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {selectedMethod === 'CARD' && (
              <>
                <Input placeholder="Cardholder Name" />
                <Input placeholder="Card Number" />
                <div className="flex gap-4">
                  <Input placeholder="MM/YY" className="w-1/2" />
                  <Input placeholder="CVV" className="w-1/2" />
                </div>
                <div className="flex gap-4 text-2xl text-neutral-400 pt-1">
                  <FaCcVisa />
                  <FaCcMastercard />
                  <FaCcAmex />
                  <FaCcDiscover />
                </div>
              </>
            )}

            {selectedMethod === 'UPI' && (
              <>
                <Input placeholder="Enter your UPI ID" />
                <div className="flex gap-3 text-2xl text-neutral-300 pt-1">
                  <SiPhonepe />
                  <FaGooglePay />
                  <SiPaytm />
                  <SiRazorpay />
                </div>
              </>
            )}

            {selectedMethod === 'NET' && (
              <>
                <select className="w-full py-3 px-4 bg-neutral-800 border border-neutral-700 rounded-md text-white">
                  <option>Select Bank</option>
                  <option>SBI</option>
                  <option>ICICI</option>
                  <option>HDFC</option>
                  <option>Axis Bank</option>
                </select>
                <FaUniversity className="text-xl text-neutral-400 mt-2" />
              </>
            )}

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-3 rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-black font-semibold shadow-lg transition"
            >
              Pay ₹{total.toLocaleString('en-IN')}
            </button>
            {error && <p className="text-red-400 text-sm pt-2">{error}</p>}
          </div>

          <div className="flex flex-col gap-3 text-xs text-neutral-500 mt-8">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />
              <span>256-bit SSL encryption ensures your data is protected</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLock className="text-emerald-400" />
              <span>PCI-DSS compliant payment processing</span>
            </div>
            <div className="flex items-center gap-2">
              <FaInfoCircle className="text-blue-400" />
              <span>Refunds available within 24 hours if booking fails</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBolt className="text-yellow-400" />
              <span>Instant confirmation once payment is successful</span>
            </div>
            <div className="flex items-center gap-2">
              <FaGift className="text-pink-400" />
              <span>Earn LuxePoints on every booking</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Input({ placeholder, className = "" }) {
  return (
    <input
      placeholder={placeholder}
      className={`w-full py-3 px-4 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-white/40 ${className}`}
    />
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
    <div className="flex justify-between items-center text-white/90">"{""}
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
