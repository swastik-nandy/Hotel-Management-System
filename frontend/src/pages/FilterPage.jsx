import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function FilterPage() {
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [priceMap, setPriceMap] = useState({});

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [branchRes, priceRes] = await Promise.all([
          api.get("/api/branch/all"),
          api.get("/api/price"),
        ]);

        setBranches(branchRes.data);
        if (branchRes.data.length > 0) setSelectedBranch(branchRes.data[0]);

        const map = {};
        const types = [];
        priceRes.data.forEach((item) => {
          map[item.roomType] = item.pricePerNight;
          types.push(item.roomType);
        });

        setPriceMap(map);
        setRoomTypes(types);
        if (types.length > 0) setSelectedType(types[0]);
      } catch (err) {
        console.error("Failed to fetch branches or prices", err);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      setMessage("Please select both check-in and check-out dates.");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));

    const perNight = priceMap[selectedType];

    if (!perNight) {
      setMessage("Price data not available. Try again later.");
      return;
    }

    const totalPrice = nights * perNight;

    setLoading(true);
    setMessage("");

    try {
      const res = await api.get("/api/room/available", {
        params: {
          branchId: selectedBranch.id,
          type: selectedType,
          checkIn,
          checkOut,
        },
      });

      const rooms = res.data;
      if (rooms.length > 0) {
        const room = rooms[0];
        navigate(`/book/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&price=${totalPrice}&roomType=${selectedType}&branchId=${selectedBranch.id}`);
      } else {
        setMessage("No available rooms found for selected criteria.");
      }
    } catch (error) {
      console.error("Error checking availability", error);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-[#f3eee9] to-[#d8cfc7] text-black py-20 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl space-y-10"
      >
        <h2
          style={{ fontFamily: "'Allura', cursive", fontWeight: 600 }}
          className="text-6xl text-center text-[#5a4234] leading-snug tracking-wide decoration-[#5a4234]"
        >
          Find Your Perfect Room
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-visible">
          {/* Branch */}
          <div className="relative z-30">
            <Listbox value={selectedBranch} onChange={setSelectedBranch}>
              <div className="relative">
                <Listbox.Label className="block mb-1 font-medium text-[#5a4234]">Branch</Listbox.Label>
                <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white border-2 border-[#9f897c] py-3 pl-4 pr-10 text-left shadow-sm focus:outline-none">
                  <span>{selectedBranch?.name || "Select a branch"}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-[#5a4234]" />
                  </span>
                </Listbox.Button>
                <Transition
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white border border-[#9f897c] shadow-lg z-30">
                    {branches.map((branch) => (
                      <Listbox.Option
                        key={branch.id}
                        value={branch}
                        className={({ active }) =>
                          `cursor-pointer select-none py-2 px-4 ${
                            active ? "bg-[#e7dcd2] text-black" : "text-[#5a4234]"
                          }`
                        }
                      >
                        {branch.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Room Type */}
          <div className="relative z-20">
            <Listbox value={selectedType} onChange={setSelectedType}>
              <div className="relative">
                <Listbox.Label className="block mb-1 font-medium text-[#5a4234]">Room Type</Listbox.Label>
                <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white border-2 border-[#9f897c] py-3 pl-4 pr-10 text-left shadow-sm focus:outline-none">
                  <span>{selectedType}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-[#5a4234]" />
                  </span>
                </Listbox.Button>
                <Transition
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white border border-[#9f897c] shadow-lg z-20">
                    {roomTypes.map((type) => (
                      <Listbox.Option
                        key={type}
                        value={type}
                        className={({ active }) =>
                          `cursor-pointer select-none py-2 px-4 ${
                            active ? "bg-[#e7dcd2] text-black" : "text-[#5a4234]"
                          }`
                        }
                      >
                        {type}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Check-in */}
          <div>
            <label className="block mb-1 font-medium text-[#5a4234]">Check-in</label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => {
                const val = e.target.value;
                setCheckIn(val);
                if (checkOut && new Date(val) > new Date(checkOut)) {
                  setCheckOut("");
                }
              }}
              className="w-full py-3 px-4 border-2 border-[#9f897c] rounded-xl bg-white focus:outline-none"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block mb-1 font-medium text-[#5a4234]">Check-out</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full py-3 px-4 border-2 border-[#9f897c] rounded-xl bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Button + Message */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            disabled={loading}
            className={`mt-6 px-8 py-3 rounded-full font-semibold tracking-wide transition-all duration-300 border-2 border-[#9f897c] bg-transparent text-[#5a4234] hover:bg-[#e7dcd2] hover:text-black ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Searching..." : "Check Availability"}
          </motion.button>

          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 font-medium text-center text-[#5a4234]"
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
