"use client";

import React, { useState, useEffect, use } from "react";
import { ArrowLeft, User, Car, Phone, ShieldCheck, MapPin, Navigation, Compass } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LiveTracking({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    // Dummy ride data
    const ride = {
        id: id,
        driver: "Rakesh S.",
        rating: 4.8,
        vehicleInfo: "Honda City (DL 04 AB 1234)",
        from: "Delhi",
        to: "Jaipur",
        eta: "2h 15m",
        speed: "65 km/h"
    };

    // Simulate car moving along the route
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) return 0; // Reset for demo purposes
                return p + 0.5;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-full bg-gray-100 dark:bg-gray-900 flex flex-col relative overflow-hidden text-foreground">

            {/* Top Navigation Bar overlay */}
            <div className="absolute top-0 left-0 w-full z-20 bg-white/80 dark:bg-primary/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="bg-accent/10 px-4 py-1.5 rounded-full flex items-center gap-2 border border-accent/20">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-accent font-bold text-sm tracking-wide uppercase">Live Tracking</span>
                    </div>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Fake Map Background */}
            <div className="flex-1 relative bg-[#e5e3df] dark:bg-[#1a1c23] w-full h-full">
                {/* SVG Route Path Mockup */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20" preserveAspectRatio="none">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-gray-400 dark:text-gray-600" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Animated Route Line */}
                <div className="absolute top-[20%] left-[15%] w-[70%] h-[60%] pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
                        {/* Shadow path */}
                        <path d="M0,0 C30,40 70,-20 100,100" fill="none" stroke="#cbd5e1" strokeWidth="6" className="dark:stroke-gray-800 stroke-linecap-round stroke-linejoin-round" />
                        {/* Active Progress Path */}
                        <motion.path
                            d="M0,0 C30,40 70,-20 100,100"
                            fill="none"
                            stroke="#fca311"
                            strokeWidth="6"
                            className="stroke-linecap-round stroke-linejoin-round drop-shadow-[0_0_8px_rgba(252,163,17,0.5)]"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress / 100 }}
                            transition={{ duration: 1, ease: "linear" }}
                        />

                        {/* Start Node */}
                        <circle cx="0" cy="0" r="4" fill="white" stroke="#10b981" strokeWidth="2.5" />
                        {/* End Node */}
                        <circle cx="100" cy="100" r="4" fill="white" stroke="#ef4444" strokeWidth="2.5" />
                    </svg>

                    {/* Origin Label */}
                    <div className="absolute top-[-10px] left-[-30px] bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 pointer-events-auto">
                        <span className="text-xs font-bold whitespace-nowrap">{ride.from}</span>
                    </div>

                    {/* Destination Label */}
                    <div className="absolute bottom-[-10px] right-[-30px] bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 pointer-events-auto">
                        <span className="text-xs font-bold whitespace-nowrap">{ride.to}</span>
                    </div>
                </div>

            </div>

            {/* Floating Driver Info Panel */}
            <div className="absolute bottom-6 left-0 w-full px-4 z-20">
                <div className="max-w-md mx-auto bg-white dark:bg-primary rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800">

                    {/* Trip Status Bar */}
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-4">
                        <div className="text-center flex-1 border-r border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1 flex items-center justify-center gap-1"><Compass size={14} /> ETA</p>
                            <p className="font-extrabold text-lg text-primary dark:text-white">{ride.eta}</p>
                        </div>
                        <div className="text-center flex-1 border-r border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Speed</p>
                            <p className="font-extrabold text-lg text-primary dark:text-white">{ride.speed}</p>
                        </div>
                        <div className="text-center flex-1">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Distance</p>
                            <p className="font-extrabold text-lg text-primary dark:text-white">{100 - Math.floor(progress)} km</p>
                        </div>
                    </div>

                    {/* Driver & Vehicle */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex justify-center items-center text-primary dark:text-gray-300 font-bold border-2 border-accent/50 relative">
                                <User size={20} />
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-primary"></div>
                            </div>
                            <div>
                                <h2 className="text-lg font-extrabold text-primary dark:text-white flex items-center gap-1.5 leading-tight">
                                    {ride.driver}
                                    <ShieldCheck size={16} className="text-blue-500" strokeWidth={2.5} />
                                </h2>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{ride.vehicleInfo}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => router.push('/messages')} className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition active:scale-95">
                                <Navigation size={18} className="fill-current" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-primary dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95">
                                <Phone size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Safety Tools */}
                    <button className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 rounded-xl font-bold text-sm tracking-wide transition active:scale-95">
                        Share Live Location with Family
                    </button>
                </div>
            </div>

        </div>
    );
}
