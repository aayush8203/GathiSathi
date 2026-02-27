"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useVehicle } from "@/context/VehicleContext";
import {
  Car,
  Bike,
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Wind,
  Briefcase,
  Umbrella,
  Shield,
  PlusCircle,
  Loader2,
  ChevronRight,
  Clock,
  LogOut,
  Bell,
  MessageSquare,
  AlertTriangle,
  ArrowRightCircle,
  ArrowUpDown,
  ChevronDown,
  Coins,
  Leaf,
  Navigation,
  Zap,
  ShieldAlert,
  FileText,
  User,
  Wallet,
  LayoutDashboard
} from "lucide-react";
import GatiMap from "@/components/GatiMap";
import { useUser, getUserInitial, getUserDisplayName } from "@/context/UserContext";

export default function Home() {
  const { vehicleType: mode, setVehicleType: setMode } = useVehicle();
  const { user, logout } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Form states
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  // Car specific states
  const [seats, setSeats] = useState(1);
  const [ac, setAc] = useState(false);
  const [trunkText, setTrunkText] = useState("Small");

  // Bike specific states
  const [helmetProvided, setHelmetProvided] = useState(false);
  const [rainGear, setRainGear] = useState(false);

  // Filters
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // User menu state
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Search states
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Sorting state
  const [sortBy, setSortBy] = useState<"earliest" | "price-asc" | "price-desc" | "rating">("earliest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Savings Calculator
  const [dist, setDist] = useState(25);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);

    try {
      // Build dynamic query string
      const searchParams = new URLSearchParams();
      if (mode) searchParams.append("mode", mode);
      if (from) searchParams.append("from", from);
      if (to) searchParams.append("to", to);
      if (date) searchParams.append("date", date);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rides?${searchParams.toString()}`);
      const data = await res.json();

      if (res.ok) {
        // Map the MongoDB _id to id so the frontend components don't break
        const formattedData = data.map((ride: any) => ({
          ...ride,
          id: ride._id,
          driver: ride.driver?.name || "Unknown Driver",
          rating: ride.driver?.rating || 5.0
        }));
        setSearchResults(formattedData);
      } else {
        console.error(data.msg);
      }
    } catch (err) {
      console.error("Fetch rides error:", err);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const appStyles = {
    "--app-accent": mode === "bike" ? "#f97316" : "#eab308", // Electric Orange / Safety Yellow
    "--app-accent-hover": mode === "bike" ? "#ea580c" : "#ca8a04",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-transparent relative text-foreground transition-colors duration-500" style={appStyles}>
      {/* Navbar Minimal - Authenticated State */}
      <nav className="flex items-center justify-between px-8 py-3 w-full max-w-7xl mx-auto border-b border-gray-200 dark:border-gray-800 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition scale-105 origin-left -my-4">
          <img src="/logo.png" alt="GatiSathi Logo" className="h-24 md:h-28 w-auto object-contain dark:invert dark:hue-rotate-180 dark:brightness-150 dark:contrast-125 drop-shadow-sm transition-all" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/publish" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-accent hover:bg-accent/10 transition shadow-sm border border-accent/20">
            <PlusCircle size={20} />
            Publish a ride
          </Link>

          <div className="flex items-center gap-2 relative">


            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative">
                <div
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 ml-2 cursor-pointer bg-white dark:bg-gray-800 p-1.5 pr-4 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                    {getUserInitial(user)}
                  </div>
                  <span className="font-semibold text-sm hidden md:block select-none">{getUserDisplayName(user)}</span>
                </div>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden"
                    >
                      <Link href="/profile" className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-gray-700 dark:text-gray-300">
                        <User size={16} /> Manage Profile
                      </Link>
                      <Link href="/dashboard" className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-gray-700 dark:text-gray-300">
                        <LayoutDashboard size={16} /> My Dashboard
                      </Link>
                      <Link href="/messages" className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-gray-700 dark:text-gray-300">
                        <MessageSquare size={16} /> Messages
                      </Link>
                      <Link href="/wallet" className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-gray-700 dark:text-gray-300">
                        <Wallet size={16} /> Wallet & Earnings
                      </Link>
                      <Link href="/login" onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-red-600 dark:text-red-400 border-t border-gray-100 dark:border-gray-700/50">
                        <LogOut size={16} /> Sign out
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link href="/login" className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 hover:text-accent transition">
                  Log in
                </Link>
                <Link href="/login" className="px-5 py-2.5 rounded-xl font-bold bg-primary text-white dark:bg-white dark:text-primary hover:bg-gray-800 dark:hover:bg-gray-200 shadow-sm transition">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full max-w-5xl mx-auto px-4 pt-12 pb-16">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary dark:text-white">
            Your ride, your choice.
            <span className="block text-accent mt-2">Arrive together.</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Choose between carpooling or finding a pillion seat on a bike. Verified users, easy rides.
          </p>
        </div>

        {/* Central Bike vs Car Switch */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded-2xl flex relative shadow-inner">
            <button
              onClick={() => setMode("car")}
              className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-colors \${
                mode === "car" ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <Car size={20} />
              Car Mode
            </button>
            <button
              onClick={() => setMode("bike")}
              className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-colors \${
                mode === "bike" ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <Bike size={20} />
              Bike Mode
            </button>
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-accent-yellow rounded-xl shadow-md z-0"
              initial={false}
              animate={{ left: mode === "car" ? "4px" : "calc(50%)" }}
            />
          </div>
        </div>

        {/* Map Integration Widget */}
        <div className="mb-8">
          <GatiMap vehicleType={mode as "car" | "bike"} />
        </div>

        {/* Search Widget */}
        <motion.div
          key="search-widget"
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-primary shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[24px] p-6 lg:p-8"
        >
          {/* Main Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* From */}
            <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Leaving from..."
                className="bg-transparent w-full outline-none font-medium text-primary dark:text-white"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            {/* To */}
            <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
              <MapPin className="text-accent mr-3" size={20} />
              <input
                type="text"
                placeholder="Going to..."
                className="bg-transparent w-full outline-none font-medium text-primary dark:text-white"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
              <Calendar className="text-gray-400 mr-3" size={20} />
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="bg-transparent w-full outline-none font-medium text-primary dark:text-white appearance-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Base Seats (If Car) - Otherwise Search button replaces it and spans 1 */}
            {mode === "car" ? (
              <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
                <Users className="text-gray-400 mr-3" size={20} />
                <select
                  className="bg-transparent w-full outline-none font-medium text-primary dark:text-white appearance-none"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n} className="dark:bg-primary">{n} Seat{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                <Users className="text-gray-400 mr-3" size={20} />
                <span className="text-primary dark:text-white font-medium">1 Pillion Seat</span>
              </div>
            )}
          </div>

          <hr className="border-gray-100 dark:border-gray-800 my-6" />

          {/* Mode Specific Preferences & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">

            <div className="lg:col-span-8 space-y-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ride Preferences</p>

              <AnimatePresence mode="wait">
                {mode === "car" ? (
                  <motion.div
                    key="car-prefs"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-wrap gap-4"
                  >
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors \${ac ? 'bg-accent border-accent text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                        {ac && <CheckCircle2 size={14} />}
                      </div>
                      <Wind size={18} className="text-gray-500" />
                      <span className="font-medium text-sm">AC Required</span>
                      <input type="checkbox" className="hidden" checked={ac} onChange={(e) => setAc(e.target.checked)} />
                    </label>

                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl">
                      <Briefcase size={18} className="text-gray-500" />
                      <span className="font-medium text-sm text-gray-500 dark:text-gray-400 mr-2">Trunk Space</span>
                      <select
                        className="bg-transparent font-medium text-primary dark:text-white outline-none text-sm"
                        value={trunkText}
                        onChange={e => setTrunkText(e.target.value)}
                      >
                        <option value="None" className="dark:bg-primary">None</option>
                        <option value="Small" className="dark:bg-primary">Small</option>
                        <option value="Medium" className="dark:bg-primary">Medium</option>
                        <option value="Large" className="dark:bg-primary">Large</option>
                      </select>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="bike-prefs"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-wrap gap-4"
                  >
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors \${helmetProvided ? 'bg-accent border-accent text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                        {helmetProvided && <CheckCircle2 size={14} />}
                      </div>
                      <Shield size={18} className="text-gray-500" />
                      <span className="font-medium text-sm">Helmet Provided</span>
                      <input type="checkbox" className="hidden" checked={helmetProvided} onChange={(e) => setHelmetProvided(e.target.checked)} />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors \${rainGear ? 'bg-accent border-accent text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                        {rainGear && <CheckCircle2 size={14} />}
                      </div>
                      <Umbrella size={18} className="text-gray-500" />
                      <span className="font-medium text-sm">Rain Gear Included</span>
                      <input type="checkbox" className="hidden" checked={rainGear} onChange={(e) => setRainGear(e.target.checked)} />
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Global Filters */}
              <div className="flex flex-wrap gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer pt-2 group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors \${verifiedOnly ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-green-500'}`}>
                    {verifiedOnly && <CheckCircle2 size={14} />}
                  </div>
                  <span className="font-medium text-sm">Verified Owners Only</span>
                  <input type="checkbox" className="hidden" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                </label>
              </div>
            </div>

            <div className="lg:col-span-4 h-full flex items-end justify-end mt-4 lg:mt-0">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full lg:w-auto bg-accent hover:bg-accent-hover disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-accent/30 transition-transform active:scale-95"
              >
                {isSearching ? <Loader2 size={22} className="animate-spin" /> : <Search size={22} />}
                {isSearching ? "Searching..." : "Find Rides"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 space-y-4 max-w-4xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 mb-6">
                <h2 className="text-2xl font-bold text-primary dark:text-white">Available Rides</h2>

                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition font-medium text-sm text-gray-600 dark:text-gray-300"
                  >
                    <ArrowUpDown size={16} className="text-accent" />
                    <span>Sort by: {sortBy === 'price-asc' ? 'Low Price' : sortBy === 'price-desc' ? 'High Price' : sortBy === 'rating' ? 'Top Rated' : 'Earliest'}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {showSortMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 sm:right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20 overflow-hidden"
                      >
                        {[
                          { value: "earliest", label: "Earliest Departure" },
                          { value: "price-asc", label: "Lowest Price" },
                          { value: "price-desc", label: "Highest Price" },
                          { value: "rating", label: "Top Rated" },
                        ].map(option => (
                          <button
                            key={option.value}
                            onClick={() => { setSortBy(option.value as any); setShowSortMenu(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition \${sortBy === option.value ? 'text-accent' : 'text-gray-600 dark:text-gray-300'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {[...searchResults].sort((a, b) => {
                if (sortBy === "price-asc") return a.price - b.price;
                if (sortBy === "price-desc") return b.price - a.price;
                if (sortBy === "rating") return b.rating - a.rating;
                if (sortBy === "earliest") return a.time.localeCompare(b.time);
                return 0;
              }).map((ride) => (
                <div key={ride.id} className="bg-white dark:bg-primary shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100 dark:border-gray-800 rounded-[20px] p-6 lg:p-8 flex flex-col cursor-pointer group hover:border-accent/30">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-start gap-4 lg:gap-6">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-300 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                        {mode === "car" ? <Car size={28} /> : <Bike size={28} />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-xl dark:text-white">{ride.from}</span>
                          <ChevronRight size={18} className="text-gray-400" />
                          <span className="font-bold text-xl dark:text-white">{ride.to}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="flex items-center gap-1.5"><Calendar size={16} /> {ride.date}</span>
                          <span className="flex items-center gap-1.5"><Clock size={16} /> {ride.time}</span>
                          <span className="flex items-center gap-1.5 text-accent bg-accent/10 dark:bg-accent/20 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide">
                            {ride.vehicleInfo}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <div className="w-7 h-7 bg-primary dark:bg-gray-700 rounded-full flex justify-center items-center text-xs text-white dark:text-gray-100 font-bold">
                            {ride.driver[0]}
                          </div>
                          <span>{ride.driver}</span>
                          <span className="text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-yellow-500 flex items-center font-bold">★ {ride.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-5 md:pt-0 pl-0 md:pl-8 leading-none">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full inline-flex">
                        {ride.seatsOffered} seat{ride.seatsOffered > 1 ? 's' : ''} left
                      </span>
                      <div className="text-right">
                        <span className="block text-3xl font-extrabold text-primary dark:text-white group-hover:text-accent transition-colors">
                          ₹{ride.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="w-full flex flex-col md:flex-row items-center gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Link href={`/book/${ride.id}`} className="flex-1 w-full bg-primary text-white dark:bg-gray-100 dark:text-primary hover:bg-gray-800 dark:hover:bg-white px-4 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 transition active:scale-95">
                      <ArrowRightCircle size={18} /> Request to Join
                    </Link>
                    <Link href={`/messages`} className="flex-1 w-full bg-gray-100 dark:bg-gray-800 text-primary dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 transition active:scale-95">
                      <MessageSquare size={18} /> Message Driver
                    </Link>
                    <Link href={`/book/${ride.id}`} className="flex-1 w-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary hover:border-gray-400 dark:hover:text-white dark:hover:border-gray-500 px-4 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 transition active:scale-95">
                      View Details
                    </Link>
                    <button className="p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 transition shadow-sm group" title="Report Ride">
                      <AlertTriangle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Waitlist Form */}
        <AnimatePresence>
          {hasSearched && !isSearching && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-12 bg-white dark:bg-primary border border-gray-200 dark:border-gray-800 rounded-3xl p-10 max-w-2xl mx-auto text-center shadow-lg shadow-gray-200/50 dark:shadow-none"
            >
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Bell size={32} />
              </div>
              <h3 className="text-2xl font-extrabold text-primary dark:text-white mb-2">No active rides right now.</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find any {mode} rides leaving from {from || "your location"} today. Do you want us to notify you when a driver publishes this route?</p>

              <button className="bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-accent/30 mx-auto transition-transform active:scale-95">
                <Bell size={20} />
                Notify Me!
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- NEW COMPONENTS START HERE --- */}


        {/* How It Works */}
        <div className="mt-24 w-full">
          <h2 className="text-3xl font-extrabold text-center text-primary dark:text-white mb-12">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[20px] border border-gray-100 dark:border-gray-700 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">1. Find</h3>
              <p className="text-gray-500">Pick your route and preferred ride mode instantly.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[20px] border border-gray-100 dark:border-gray-700 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center relative">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">2. Book</h3>
              <p className="text-gray-500">Confirm your seat with verified students and drivers.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[20px] border border-gray-100 dark:border-gray-700 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <Navigation size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">3. Go</h3>
              <p className="text-gray-500">Enjoy a safe, affordable, and eco-friendly trip.</p>
            </div>
          </div>
        </div>

        {/* Savings Calculator Widget */}
        <div className="mt-24 w-full bg-[#F5F6FA] dark:bg-gray-800/50 rounded-[20px] p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-primary dark:text-white mb-4">Savings Calculator</h2>
              <p className="text-gray-500 mb-8 max-w-sm">See how much you save monthly by switching from cabs to GatiSathi.</p>

              <div className="mb-6">
                <div className="flex justify-between font-bold mb-2 dark:text-white">
                  <span>Daily Commute</span>
                  <span className="text-accent">{dist} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={dist}
                  onChange={(e) => setDist(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-[20px] shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <Coins size={24} />
                </div>
                <div>
                  <p className="text-gray-500 font-medium text-sm mb-1">Estimated Monthly Savings</p>
                  <p className="text-3xl font-extrabold text-primary dark:text-white">₹{(dist * 5 * 20).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Leaf size={24} />
                </div>
                <div>
                  <p className="text-gray-500 font-medium text-sm mb-1">CO2 Reduced</p>
                  <p className="text-3xl font-extrabold text-primary dark:text-white">{(dist * 0.12 * 20).toFixed(1)} kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Local Routes */}
        <div className="mt-24 w-full">
          <h2 className="text-3xl font-extrabold text-primary dark:text-white mb-8">Top Local Routes</h2>
          <div className="flex overflow-x-auto gap-6 pb-4 snap-x hide-scrollbar">
            {[
              { route: "Hinjewadi to SPPU", price: 40, time: "25 min" },
              { route: "Palghar to Mumbai", price: 150, time: "1h 45m" },
              { route: "Wakad to Baner", price: 20, time: "15 min" },
              { route: "Kothrud to Camp", price: 30, time: "20 min" }
            ].map(item => (
              <div key={item.route} className="min-w-[280px] snap-center bg-white dark:bg-gray-800 rounded-[20px] p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0 hover:border-accent/50 transition">
                <h3 className="font-bold text-xl mb-4 dark:text-white leading-tight">{item.route}</h3>
                <div className="flex items-center justify-between text-gray-500 mb-6 font-medium">
                  <span className="flex items-center gap-1.5"><Clock size={16} /> {item.time}</span>
                  <span className="text-primary dark:text-gray-200 font-bold">Avg: ₹{item.price}</span>
                </div>
                <button
                  onClick={() => {
                    setFrom(item.route.split(" to ")[0]);
                    setTo(item.route.split(" to ")[1]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-accent/10 text-accent hover:bg-accent hover:text-white w-full py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                  <Zap size={18} /> Fast-Book
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Trust Bento Grid */}
        <div className="mt-24 w-full mb-12">
          <h2 className="text-3xl font-extrabold text-center text-primary dark:text-white mb-12">Trust & Safety First</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 auto-rows-fr">
            {/* Large Tile */}
            <div className="col-span-1 md:col-span-2 row-span-2 bg-[#2d3436] dark:bg-gray-900 rounded-[20px] p-8 md:p-12 border border-gray-700 text-white flex flex-col justify-end items-start overflow-hidden relative shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-colors duration-500" />
              <ShieldAlert size={48} className="text-accent mb-6 transition-colors duration-500" />
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4">Verified Riders Only</h3>
              <p className="text-gray-400 max-w-sm text-lg leading-relaxed">Every user is strictly vetted with government identification.</p>
            </div>
            {/* Small Tile 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-[20px] p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-center relative overflow-hidden shadow-sm group">
              <div className="w-24 h-24 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform">
                <AlertTriangle size={48} className="opacity-50" />
              </div>
              <h4 className="font-bold text-xl dark:text-white mb-2 relative z-10">SOS Button</h4>
              <p className="text-sm text-gray-500 relative z-10">24/7 emergency response & location sharing.</p>
            </div>
            {/* Small Tile 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-[20px] p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-center shadow-sm">
              <Users size={32} className="text-accent mb-4 transition-colors duration-500" />
              <h4 className="font-bold text-xl dark:text-white mb-2">Gender Filter</h4>
              <p className="text-sm text-gray-500">Women-only ride options available.</p>
            </div>
            {/* Flat Pricing */}
            <div className="bg-accent transition-colors duration-500 rounded-[20px] p-6 md:p-8 text-white col-span-1 md:col-span-3 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-accent/20">
              <div>
                <h4 className="font-extrabold text-2xl mb-2 flex items-center gap-3">
                  <Zap size={28} className="fill-white" />
                  Flat Pricing, No Surge
                </h4>
                <p className="text-white/80 font-medium">Pay exactly what's shown. No hidden fees or weather surcharges.</p>
              </div>
              <div className="mt-6 md:mt-0 px-6 py-3 bg-white/20 rounded-xl font-bold backdrop-blur-sm border border-white/30">
                Always Honest
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer at absolute document end */}
      <footer className="w-full max-w-7xl mx-auto px-6 pb-4 border-t border-gray-200 dark:border-gray-800/60 pt-4 flex flex-col-reverse md:flex-row items-center justify-between text-sm text-gray-500 gap-4 relative z-10">
        <Link href="#" className="flex items-center gap-2 hover:text-accent transition font-medium">
          <FileText size={18} /> Terms and Conditions & Privacy
        </Link>
        <div className="flex flex-col items-center md:items-end gap-1 select-none text-primary dark:text-gray-100">
          <div className="flex items-center gap-2 font-bold opacity-90 -my-4 md:-my-6">
            <img src="/logo.png" alt="GatiSathi Logo" className="h-16 md:h-20 w-auto object-contain grayscale opacity-80 dark:invert dark:hue-rotate-180 dark:brightness-150 dark:contrast-125 transition-all" />
            <span className="text-gray-400 font-normal text-sm">© {new Date().getFullYear()}</span>
          </div>
          <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold tracking-wide flex items-center gap-1.5 opacity-80">
            Made with <span className="text-red-500 text-sm animate-pulse">❤️</span> in India
          </span>
        </div>
      </footer>

      {/* Dynamic Map Hero Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none transition-colors duration-700 bg-background">
        <div className="absolute inset-0 bg-white/60 dark:bg-primary/80 z-10 transition-colors duration-300"></div>
        <img
          src="/landing_map_bg.png"
          alt="Map Background"
          className="w-full h-full object-cover opacity-60 filter grayscale mix-blend-multiply dark:mix-blend-lighten"
        />
      </div>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten transition-colors duration-500" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten transition-colors duration-500" />
      </div>
    </div>
  );
}
