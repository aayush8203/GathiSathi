"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Car,
    Bike,
    Calendar,
    MapPin,
    Users,
    ChevronRight,
    Clock,
    CheckCircle2,
    ShieldCheck,
    LogOut,
    Wallet,
    MessageSquare,
    User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { useUser, getUserInitial, getUserDisplayName } from "@/context/UserContext";
import { useRouter } from "next/navigation";

type Tab = "bookings" | "offered";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("bookings");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useUser();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const [bookings, setBookings] = useState<any[]>([]);
    const [offeredRides, setOfferedRides] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Fetch bookings
                const resBookings = await fetch('http://localhost:5000/api/bookings/my-bookings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataBookings = await resBookings.json();

                if (resBookings.ok) {
                    const formatted = dataBookings.map((b: any) => ({
                        id: b.ride?._id,
                        mode: b.ride?.mode || "car",
                        from: b.ride?.from || "Unknown",
                        to: b.ride?.to || "Unknown",
                        date: b.ride?.date ? new Date(b.ride.date).toLocaleDateString() : "Unknown",
                        time: b.ride?.time || "Unknown",
                        status: b.status,
                        driver: b.driver?.name || "Unknown",
                        price: b.pricePaid
                    }));
                    setBookings(formatted);
                }

                // Fetch offered rides
                const resOffered = await fetch('http://localhost:5000/api/rides/my-rides', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataOffered = await resOffered.json();

                if (resOffered.ok) {
                    const formattedOffered = dataOffered.map((r: any) => ({
                        id: r._id,
                        mode: r.mode || "car",
                        from: r.from || "Unknown",
                        to: r.to || "Unknown",
                        date: r.date ? new Date(r.date).toLocaleDateString() : "Unknown",
                        time: r.time || "Unknown",
                        seatsOffered: r.seatsOffered,
                        seatsBooked: r.seatsBooked || 0,
                        price: r.price
                    }));
                    setOfferedRides(formattedOffered);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Navbar Minimal */}
            <nav className="flex items-center justify-between px-8 py-3 w-full max-w-7xl mx-auto border-b border-gray-200 dark:border-gray-800">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition scale-105 origin-left -my-4">
                    <img src="/logo.png" alt="GatiSathi Logo" className="h-24 md:h-28 w-auto object-contain dark:invert dark:hue-rotate-180 dark:brightness-150 dark:contrast-125 drop-shadow-sm transition-all" />
                </Link>
                <div className="flex items-center gap-2 relative">


                    {/* User Menu */}
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
                                    <Link href="/home" className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-primary dark:text-gray-200">
                                        <Car size={16} /> Find Rides
                                    </Link>
                                    <Link href="/profile" className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-primary dark:text-gray-200">
                                        <UserIcon size={16} /> Manage Profile
                                    </Link>
                                    <Link href="/messages" className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-primary dark:text-gray-200">
                                        <MessageSquare size={16} /> Messages
                                    </Link>
                                    <Link href="/wallet" className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-primary dark:text-gray-200">
                                        <Wallet size={16} /> Wallet & Earnings
                                    </Link>
                                    <hr className="border-gray-100 dark:border-gray-700 my-1" />
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-red-600 dark:text-red-400">
                                        <LogOut size={16} /> Sign out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            <main className="w-full max-w-5xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-extrabold mb-8 text-primary dark:text-white">My Dashboard</h1>

                {/* Tab Switcher */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 relative">
                    <button
                        className={`pb-4 px-6 text-lg font-semibold transition-colors \${activeTab === "bookings" ? "text-accent" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                        onClick={() => setActiveTab("bookings")}
                    >
                        My Bookings
                    </button>
                    <button
                        className={`pb-4 px-6 text-lg font-semibold transition-colors \${activeTab === "offered" ? "text-accent" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                        onClick={() => setActiveTab("offered")}
                    >
                        My Offered Rides
                    </button>

                    <motion.div
                        className="absolute bottom-[-1px] h-1 bg-accent rounded-t-lg"
                        initial={false}
                        animate={{
                            width: activeTab === "bookings" ? "140px" : "180px",
                            left: activeTab === "bookings" ? "16px" : "160px"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>

                {/* List View */}
                <AnimatePresence mode="wait">
                    {activeTab === "bookings" ? (
                        <motion.div
                            key="bookings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {bookings.length > 0 ? bookings.map(ride => (
                                <div key={ride.id} className="bg-white dark:bg-primary rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition group select-none cursor-pointer">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-300">
                                                {ride.mode === "car" ? <Car size={24} /> : <Bike size={24} />}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="font-bold text-lg dark:text-white">{ride.from}</span>
                                                    <ChevronRight size={16} className="text-gray-400" />
                                                    <span className="font-bold text-lg dark:text-white">{ride.to}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><Calendar size={14} /> {ride.date}</span>
                                                    <span className="flex items-center gap-1"><Clock size={14} /> {ride.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col justify-between items-end">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold \${
                        ride.status === 'Upcoming' ? 'bg-accent-yellow/20 text-yellow-700 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                                                {ride.status}
                                            </div>
                                            <div className="text-right mt-2 md:mt-0 flex flex-col items-end gap-1">
                                                <span className="block text-2xl font-bold dark:text-white leading-none mb-1">₹{ride.price}</span>
                                                <span className="text-xs text-gray-500 mb-2">Driver: {ride.driver}</span>
                                                {ride.status === 'Upcoming' && (
                                                    <Link href={`/track/${ride.id}`} className="flex items-center gap-1.5 bg-accent/10 hover:bg-accent hover:text-white text-accent border border-accent/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm">
                                                        <MapPin size={14} /> Live Track
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500">No bookings found.</p>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="offered"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-end mb-4">
                                <Link href="/publish" className="bg-primary text-white dark:bg-gray-100 dark:text-primary px-6 py-2 rounded-xl font-bold shadow hover:scale-105 transition-transform flex items-center justify-center">
                                    + Offer a Ride
                                </Link>
                            </div>

                            {offeredRides.length > 0 ? offeredRides.map(ride => (
                                <div key={ride.id} className="bg-white dark:bg-primary rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary dark:text-gray-300">
                                                {ride.mode === "car" ? <Car size={24} /> : <Bike size={24} />}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="font-bold text-lg dark:text-white">{ride.from}</span>
                                                    <ChevronRight size={16} className="text-gray-400" />
                                                    <span className="font-bold text-lg dark:text-white">{ride.to}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><Calendar size={14} /> {ride.date}</span>
                                                    <span className="flex items-center gap-1"><Clock size={14} /> {ride.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col justify-between items-end gap-3 md:gap-0">
                                            <div className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">
                                                <Users size={16} />
                                                <span className="font-bold">{ride.seatsBooked}/{ride.seatsOffered} Booked</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-2xl font-bold dark:text-white">₹{ride.price}<span className="text-sm text-gray-400 font-normal">/seat</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500">No rides offered yet.</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
