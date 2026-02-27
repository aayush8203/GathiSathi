"use client";

import React, { useState, use, useEffect } from "react";
import { ArrowLeft, ShieldCheck, MapPin, Clock, Calendar, CheckCircle2, User, Car, Bike, AlertTriangle, MessageSquare, Zap, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function BookRide({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<"upi" | "cash">("upi");

    const [ride, setRide] = React.useState<any>(null);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            const fetchRide = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rides/${id}`);
                    const data = await res.json();
                    if (res.ok) {
                        setRide({
                            ...data,
                            id: data._id,
                            driver: data.driver?.name || "Unknown Driver",
                            phone: data.driver?.phone || "N/A",
                            rating: data.driver?.rating || 5.0,
                            verified: data.driver?.isVerified || false,
                            totalTrips: data.driver?.totalTrips || 0
                        });
                    } else {
                        alert("This ride no longer exists or couldn't be loaded.");
                    }
                } catch (error) {
                    console.error("Fetch Ride error:", error);
                }
            };
            fetchRide();
        }
    }, [id, router]);

    const handleConfirmBooking = async () => {
        setIsProcessing(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please log in to book a ride.");
                router.push('/login');
                return;
            }

            const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rideId: id,
                    paymentMethod: selectedPayment,
                    pricePaid: selectedPayment === 'upi' ? ride?.price : 0
                })
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const data = await res.json();
                alert(data.msg || "Booking failed");
            }
        } catch (error) {
            console.error("Booking Error:", error);
            alert("Could not process booking. Is the backend running?");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!ride) return <div className="min-h-screen flex justify-center items-center text-primary font-bold">Loading Ride Data...</div>;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-primary dark:text-white mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                        Your seat with {ride.driver} has been successfully reserved. The driver has been notified!
                    </p>

                    <div className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 mb-8 text-left space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-500 text-sm">Booking ID</span>
                            <span className="font-bold text-primary dark:text-white uppercase tracking-wider">#GS-{Math.floor(Math.random() * 90000) + 10000}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Total Paid</span>
                            <span className="font-bold text-accent">₹{selectedPayment === "upi" ? ride.price : "0 (Pay Cash)"}</span>
                        </div>
                    </div>

                    <Link href="/dashboard" className="w-full bg-primary hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-primary px-6 py-4 rounded-xl font-bold flex justify-center items-center transition active:scale-95">
                        Go to Dashboard
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-primary/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-colors">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400 focus:outline-none">
                        <ArrowLeft size={20} />
                    </button>
                    <span className="font-bold text-lg text-primary dark:text-white absolute left-1/2 -translate-x-1/2">Confirm Booking</span>
                    <div className="w-10"></div> {/* Spacer for perfect centering */}
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 pt-24 space-y-6">

                {/* Driver & Ride Summary */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex justify-center items-center text-primary dark:text-gray-300 font-bold border-2 border-accent">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-primary dark:text-white flex items-center gap-1.5">
                                    {ride.driver}
                                    {ride.verified && <ShieldCheck size={18} className="text-blue-500" strokeWidth={2.5} />}
                                </h2>
                                <p className="text-sm font-semibold text-yellow-500 flex items-center">
                                    ★ {ride.rating} <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">({ride.totalTrips} trips)</span>
                                </p>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                                    <Phone size={14} />
                                    {ride.phone}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-3xl font-extrabold text-accent">₹{ride.price}</span>
                            <span className="text-xs font-semibold text-gray-400">per seat</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl mb-6">
                        {ride.mode === 'bike' ? (
                            <Bike className="text-gray-500" size={24} />
                        ) : (
                            <Car className="text-gray-500" size={24} />
                        )}
                        <div>
                            <p className="font-bold text-primary dark:text-white">{ride.vehicleInfo}</p>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">{ride.vehicleNumber}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center mt-1">
                                <div className="w-3 h-3 rounded-full border-[3px] border-accent bg-white dark:bg-primary z-10" />
                                <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-700" />
                                <div className="w-3 h-3 rounded-full border-[3px] border-primary dark:border-gray-500 bg-white dark:bg-primary z-10" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div>
                                    <h4 className="font-bold text-primary dark:text-white leading-none">{ride.from}</h4>
                                    <span className="text-xs text-gray-500 font-medium">Anytime after {ride.time}</span>
                                </div>
                                <div className="mt-8">
                                    <h4 className="font-bold text-primary dark:text-white leading-none">{ride.to}</h4>
                                    <span className="text-xs text-gray-500 font-medium">Estimated 4 hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ride Rules */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-extrabold text-lg mb-4 text-primary dark:text-white">Ride Notes</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/20">
                        {ride.rideDetails}
                    </p>
                    <div className="flex gap-3">
                        <span className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">Only {ride.seatsOffered} seat(s) left</span>
                        <span className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">Max 1 Bag allowed</span>
                    </div>
                </div>

                {/* Payment Selection */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-extrabold text-lg mb-4 text-primary dark:text-white">Payment Method</h3>
                    <div className="space-y-3">
                        <label className={`block w-full cursor-pointer p-4 border rounded-2xl transition-all \${selectedPayment === 'upi' ? 'border-accent bg-accent/5 ring-2 ring-accent/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors \${selectedPayment === 'upi' ? 'border-accent bg-accent text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {selectedPayment === 'upi' && <div className="w-2 h-2 bg-white rounded-full block" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Zap size={18} className="text-accent" />
                                        <span className="font-bold text-primary dark:text-white">Pay Now (UPI / Card)</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 pl-6">Secure instant payment so the driver doesn&apos;t cancel.</p>
                                </div>
                            </div>
                            <input type="radio" className="hidden" name="payment" value="upi" checked={selectedPayment === 'upi'} onChange={() => setSelectedPayment('upi')} />
                        </label>

                        <label className={`block w-full cursor-pointer p-4 border rounded-2xl transition-all \${selectedPayment === 'cash' ? 'border-primary dark:border-gray-500 bg-gray-50 dark:bg-gray-800/50 ring-2 ring-primary/20 dark:ring-gray-500/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors \${selectedPayment === 'cash' ? 'border-primary dark:border-gray-500 bg-primary dark:bg-gray-500 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {selectedPayment === 'cash' && <div className="w-2 h-2 bg-white rounded-full block" />}
                                </div>
                                <div className="flex-1">
                                    <span className="font-bold text-primary dark:text-white block">Pay Cash to Driver</span>
                                    <p className="text-xs text-gray-500 mt-1">Pay during the ride manually. Driver might cancel if not paid upfront.</p>
                                </div>
                            </div>
                            <input type="radio" className="hidden" name="payment" value="cash" checked={selectedPayment === 'cash'} onChange={() => setSelectedPayment('cash')} />
                        </label>
                    </div>
                </div>

            </main>

            {/* Bottom Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-primary border-t border-gray-200 dark:border-gray-800 p-4 pb-8 z-50">
                <div className="max-w-3xl mx-auto flex gap-4 items-center">
                    <div className="hidden sm:block">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total amount</p>
                        <p className="text-2xl font-extrabold text-primary dark:text-white leading-none">₹{ride.price}</p>
                    </div>
                    <button
                        onClick={handleConfirmBooking}
                        disabled={isProcessing}
                        className="flex-1 bg-accent hover:bg-accent-hover text-white disabled:opacity-70 disabled:active:scale-100 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition active:scale-95 shadow-lg shadow-accent/20 text-lg"
                    >
                        {isProcessing ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <>
                                <CheckCircle2 size={24} /> Confirm & Book Seat
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
