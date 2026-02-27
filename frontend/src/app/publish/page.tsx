"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Car,
    Bike,
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
    ArrowRight,
    ChevronLeft,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVehicle } from "@/context/VehicleContext";

export default function PublishRide() {
    const router = useRouter();
    const { vehicleType: mode, setVehicleType: setMode } = useVehicle();
    const [step, setStep] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    // Form states
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [price, setPrice] = useState(250);

    // Car specific states
    const [seats, setSeats] = useState(3);
    const [ac, setAc] = useState(true);
    const [trunkText, setTrunkText] = useState("Medium");
    const [vehicleInfo, setVehicleInfo] = useState("");

    // Bike specific states
    const [helmetProvided, setHelmetProvided] = useState(true);
    const [rainGear, setRainGear] = useState(false);

    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Final Submit -> Route back to Home mimicking success
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert("You must be logged in to publish a ride!");
                    router.push('/login');
                    return;
                }

                const payload = {
                    mode,
                    from,
                    to,
                    date,
                    time,
                    price,
                    seatsOffered: mode === 'car' ? seats : 1,
                    vehicleInfo,
                    rideDetails: mode === 'car'
                        ? `AC: ${ac ? 'Yes' : 'No'}, Trunk: ${trunkText}`
                        : `Helmet Provided: ${helmetProvided ? 'Yes' : 'No'}, Rain Gear: ${rainGear ? 'Yes' : 'No'}`
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rides`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    router.push("/home");
                } else {
                    const data = await res.json();
                    alert(data.msg || "Failed to publish ride");
                }
            } catch (err) {
                console.error("Publish Ride Error:", err);
                alert("Could not connect to the backend server.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Navbar Minimal - Authenticated State */}
            <nav className="flex items-center justify-between px-8 py-3 w-full max-w-7xl mx-auto border-b border-gray-200 dark:border-gray-800">
                <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition scale-105 origin-left -my-4">
                    <img src="/logo.png" alt="GatiSathi Logo" className="h-24 md:h-28 w-auto object-contain dark:invert dark:hue-rotate-180 dark:brightness-150 dark:contrast-125 drop-shadow-sm transition-all" />
                </Link>
                <div className="flex items-center gap-4">


                    <Link href="/home" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-gray-500 hover:text-primary dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        Cancel & Return
                    </Link>
                </div>
            </nav>

            {/* Main Container */}
            <main className="w-full max-w-3xl mx-auto px-4 py-12 relative z-10">

                {/* Progress Guide */}
                <div className="flex items-center justify-between mb-8 px-2 relative z-10">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 -translate-y-1/2 rounded-full" />
                    <motion.div
                        className="absolute top-1/2 left-0 h-1 bg-accent -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{ width: `${(step - 1) * 50}%` }}
                    />

                    {[1, 2, 3].map((num) => (
                        <div
                            key={num}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 shadow-sm
                 ${step >= num ? 'bg-accent text-white border-4 border-white dark:border-primary' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 border-4 border-white dark:border-primary'}
               `}
                        >
                            {step > num ? <CheckCircle2 size={18} /> : num}
                        </div>
                    ))}
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-primary shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[24px] p-6 lg:p-10 border border-gray-100 dark:border-gray-800"
                >
                    <form onSubmit={handleNextStep}>

                        {/* STEP 1: Route & Mode */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-primary dark:text-white mb-2">Publish a Ride</h2>
                                    <p className="text-gray-500">Let's start with where you're going and what vehicle you're driving.</p>
                                </div>

                                {/* Central Bike vs Car Switch */}
                                <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl flex relative w-max mx-auto md:mx-0 shadow-inner">
                                    <button
                                        type="button"
                                        onClick={() => setMode("car")}
                                        className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors ${mode === "car" ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
                                            }`}
                                    >
                                        <Car size={18} /> Car
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMode("bike")}
                                        className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors ${mode === "bike" ? "text-primary dark:text-primary" : "text-gray-500 dark:text-gray-400"
                                            }`}
                                    >
                                        <Bike size={18} /> Bike
                                    </button>
                                    <motion.div
                                        layout
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md border border-gray-200/50 z-0"
                                        initial={false}
                                        animate={{ left: mode === "car" ? "6px" : "calc(50%)" }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    <div className="relative flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
                                        <span className="text-xs font-semibold text-gray-400 mb-1 flex items-center"><MapPin size={12} className="mr-1" /> Leaving From</span>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. MG Road, Bengaluru"
                                            className="bg-transparent w-full outline-none font-bold text-lg text-primary dark:text-white"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
                                        <span className="text-xs font-semibold text-accent mb-1 flex items-center"><MapPin size={12} className="mr-1" /> Going To</span>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Electronic City"
                                            className="bg-transparent w-full outline-none font-bold text-lg text-primary dark:text-white"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Time & Details */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-primary dark:text-white mb-2">When and What?</h2>
                                    <p className="text-gray-500">Pick up time, and details about your {mode === "car" ? "car" : "bike"}.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3.5 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
                                        <Calendar className="text-gray-400 mr-3 shrink-0" size={20} />
                                        <input
                                            required
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]}
                                            className="bg-transparent w-full outline-none font-medium text-primary dark:text-white appearance-none"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3.5 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
                                        <Clock className="text-gray-400 mr-3 shrink-0" size={20} />
                                        <input
                                            required
                                            type="time"
                                            className="bg-transparent w-full outline-none font-medium text-primary dark:text-white appearance-none"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3.5 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
                                    {mode === "car" ? <Car className="text-gray-400 mr-3 shrink-0" size={20} /> : <Bike className="text-gray-400 mr-3 shrink-0" size={20} />}
                                    <input
                                        required
                                        type="text"
                                        placeholder={mode === "car" ? "Vehicle Model (e.g. Honda City White)" : "Vehicle Model (e.g. Royal Enfield Black)"}
                                        className="bg-transparent w-full outline-none font-medium text-primary dark:text-white placeholder:text-gray-400"
                                        value={vehicleInfo}
                                        onChange={(e) => setVehicleInfo(e.target.value)}
                                    />
                                </div>

                                {mode === "car" ? (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition flex-1">
                                            <Users className="text-gray-400 mr-3" size={20} />
                                            <div className="flex flex-col w-full">
                                                <span className="text-xs text-gray-500 font-semibold mb-0.5">Seats to Offer</span>
                                                <select
                                                    className="bg-transparent w-full outline-none font-bold text-primary dark:text-white appearance-none"
                                                    value={seats}
                                                    onChange={(e) => setSeats(Number(e.target.value))}
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n} className="dark:bg-primary">{n} Person</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition flex-1">
                                            <Briefcase className="text-gray-400 mr-3" size={20} />
                                            <div className="flex flex-col w-full">
                                                <span className="text-xs text-gray-500 font-semibold mb-0.5">Trunk Space</span>
                                                <select
                                                    className="bg-transparent w-full outline-none font-bold text-primary dark:text-white appearance-none"
                                                    value={trunkText}
                                                    onChange={e => setTrunkText(e.target.value)}
                                                >
                                                    <option value="None" className="dark:bg-primary">None</option>
                                                    <option value="Small" className="dark:bg-primary">Small</option>
                                                    <option value="Medium" className="dark:bg-primary">Medium</option>
                                                    <option value="Large" className="dark:bg-primary">Large</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-accent p-4 rounded-xl rounded-l-none text-sm text-gray-600 dark:text-gray-300">
                                        <strong className="text-primary dark:text-white block mb-1">Pillion Notice</strong>
                                        You can only offer 1 pillion seat on a bike ride. Ensure you follow local regulations.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: Pricing & Config */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-primary dark:text-white mb-2">Final Details</h2>
                                    <p className="text-gray-500">Set your price per seat and confirm ride amenities.</p>
                                </div>

                                <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl py-8 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Price per co-traveler</h3>
                                    <div className="flex items-center gap-4">
                                        <button type="button" onClick={() => setPrice(Math.max(50, price - 50))} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition">-</button>
                                        <div className="text-6xl font-extrabold text-primary dark:text-white tracking-tighter">
                                            ₹{price}
                                        </div>
                                        <button type="button" onClick={() => setPrice(price + 50)} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition">+</button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-6">
                                    {mode === "car" ? (
                                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 px-5 py-3.5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition flex-1 justify-center">
                                            <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${ac ? 'bg-accent border-accent text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {ac && <CheckCircle2 size={16} />}
                                            </div>
                                            <Wind size={20} className="text-gray-500" />
                                            <span className="font-bold">Air Conditioned</span>
                                            <input type="checkbox" className="hidden" checked={ac} onChange={(e) => setAc(e.target.checked)} />
                                        </label>
                                    ) : (
                                        <>
                                            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 px-5 py-3.5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition flex-1 justify-center">
                                                <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${helmetProvided ? 'bg-accent border-accent text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                                    {helmetProvided && <CheckCircle2 size={16} />}
                                                </div>
                                                <Shield size={20} className="text-gray-500" />
                                                <span className="font-bold">Helmet Provided</span>
                                                <input type="checkbox" className="hidden" checked={helmetProvided} onChange={(e) => setHelmetProvided(e.target.checked)} />
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 px-5 py-3.5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition flex-1 justify-center">
                                                <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${rainGear ? 'bg-accent border-accent text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                                    {rainGear && <CheckCircle2 size={16} />}
                                                </div>
                                                <Umbrella size={20} className="text-gray-500" />
                                                <span className="font-bold">Rain Gear</span>
                                                <input type="checkbox" className="hidden" checked={rainGear} onChange={(e) => setRainGear(e.target.checked)} />
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <hr className="border-gray-100 dark:border-gray-800 my-8" />
                        <div className="flex items-center justify-between">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2"
                                >
                                    <ChevronLeft size={20} /> Back
                                </button>
                            ) : <div></div>}

                            <button
                                type="submit"
                                className="bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-accent/30 transition-all active:scale-95 ml-auto"
                            >
                                {step === 3 ? "Publish Ride" : "Continue"}
                                {step < 3 ? <ArrowRight size={20} /> : <PlusCircle size={20} />}
                            </button>
                        </div>
                    </form>
                </motion.div>

            </main>

            {/* Decorative background shapes */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-yellow/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />
            </div>
        </div>
    );
}
