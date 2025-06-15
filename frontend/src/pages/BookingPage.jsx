import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone } from "lucide-react";
import api from "../api/axiosInstance";

export default function BookingPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [checkInDate] = useState(searchParams.get("checkIn") || "");
  const [checkOutDate] = useState(searchParams.get("checkOut") || "");
  const [price] = useState(Number(searchParams.get("price") || 0));
  const [roomType] = useState(searchParams.get("roomType") || "");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const isUnavailable = roomId === "unavailable";
  const unavailableBranch = searchParams.get("branch");
  const unavailableType = searchParams.get("type");

  // ✅ Detect page refresh
  const navEntries = window.performance.getEntriesByType("navigation");
  const isRefresh = navEntries.length > 0 && navEntries[0].type === "reload";

  if (isRefresh) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white text-black text-xl font-semibold">
        404 - This page is not accessible on refresh.
      </div>
    );
  }

  const getImageForType = (type) => {
    const lower = type?.toLowerCase();
    if (lower?.includes("luxury")) return "/images/room-suite.jpg";
    if (lower?.includes("deluxe")) return "/images/room-deluxe.jpg";
    if (lower?.includes("standard")) return "/images/room-twin.webp";
    return "/images/default-room.jpg";
  };

  const formatRoomType = (type) => type;

  useEffect(() => {
    if (isUnavailable) {
      setLoading(false);
      return;
    }

    api
      .get(`/api/room/${roomId}`)
      .then((res) => {
        setRoom(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Room not found or server error.");
        setLoading(false);
      });
  }, [roomId, isUnavailable]);

  useEffect(() => {
    const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    const phoneValid = /^[6-9]\d{9}$/.test(phoneNumber);
    const nameValid =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      !firstName.includes(" ") &&
      !lastName.includes(" ");
    setIsFormValid(emailValid && phoneValid && nameValid);
  }, [firstName, middleName, lastName, email, phoneNumber]);

  const handleBooking = () => {
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

    const payload = {
      roomId: parseInt(roomId),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      customerName: fullName,
      phoneNumber,
      email,
      roomType,
      branchId: room?.branchId || room?.branch?.id,
      price: price,
    };

    navigate("/payment", { state: payload });
  };

  if (loading) {
    return (
      <div className="text-center py-32 text-lg text-gray-700">
        Loading room details...
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-white to-[#dfcbb2] px-4 py-14 md:px-12 text-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
      >
        <img
          src={getImageForType(isUnavailable ? unavailableType : roomType)}
          alt={isUnavailable ? unavailableType : roomType}
          className="w-full h-64 object-cover"
        />

        <div className="p-8 space-y-6">
          <h1
            style={{
              fontFamily: "'Allura', cursive",
              fontWeight: 600,
              textDecorationColor: "#5a4234",
              textUnderlineOffset: "6px",
              textDecorationThickness: "1.5px",
            }}
            className="text-4xl text-[#5a4234] tracking-wide"
          >
            {isUnavailable
              ? `${formatRoomType(unavailableType)} Room`
              : `${formatRoomType(roomType)} Room`}
          </h1>

          <p className="text-gray-600">
            {isUnavailable
              ? `All rooms in our ${unavailableBranch} branch are booked.`
              : `Room #${room?.roomNumber} · ${room?.branchName || room?.branch?.name}`}
          </p>

          {!isUnavailable && (
            <div className="flex justify-between items-center bg-yellow-100 border border-yellow-300 rounded-xl p-4">
              <p className="text-yellow-600 font-semibold text-lg">
                ₹
                {(price /
                  Math.max(
                    1,
                    Math.ceil(
                      (new Date(checkOutDate) - new Date(checkInDate)) /
                        (1000 * 60 * 60 * 24)
                    )
                  )).toLocaleString("en-IN")}{" "}
                / night
              </p>
              <p className="text-yellow-600 font-medium text-lg">
                Total Price : ₹{price.toLocaleString("en-IN")}
              </p>
            </div>
          )}

          {!isUnavailable && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value.replace(/\s/g, ""))
                    }
                    className="pl-10 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Middle Name (optional)"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value.replace(/\s/g, ""))
                    }
                    className="pl-10 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={10}
                  className="pl-10 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBooking}
                disabled={!isFormValid}
                className={`mt-6 w-full md:w-auto font-semibold tracking-wide px-6 py-3 rounded-full transition-all duration-300 shadow-md ${
                  !isFormValid
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:shadow-lg text-black"
                }`}
              >
                CONFIRM BOOKING
              </motion.button>
            </>
          )}

          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 text-center font-medium text-[#5a4234]"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
