"use client";

import React, { useState } from "react";
import { Search, MessageSquare, ShieldCheck, ArrowLeft, Plus, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Simulated conversation data — in production, this would be fetched from a WebSocket or REST API
const conversations = [
    {
        id: "conv-1",
        person: "Rakesh S.",
        initial: "R",
        color: "bg-accent",
        lastMessage: "Yep, I have two seats left. Where do you want to get picked up?",
        time: "10:35 AM",
        unread: 2,
        route: "Delhi → Jaipur",
        isOnline: true,
        isVerified: true,
        rideDate: "Today",
    },
    {
        id: "conv-2",
        person: "Priya M.",
        initial: "P",
        color: "bg-purple-500",
        lastMessage: "Okay, I'll be at MG Road Metro at 7:30 AM.",
        time: "Yesterday",
        unread: 0,
        route: "Hinjewadi → SPPU",
        isOnline: false,
        isVerified: true,
        rideDate: "Yesterday",
    },
    {
        id: "conv-3",
        person: "Amit K.",
        initial: "A",
        color: "bg-emerald-500",
        lastMessage: "Sure, the ride leaves at 9 AM from Sector 18.",
        time: "Oct 24",
        unread: 0,
        route: "Noida → Gurgaon",
        isOnline: false,
        isVerified: false,
        rideDate: "Oct 24",
    },
    {
        id: "conv-4",
        person: "Sneha R.",
        initial: "S",
        color: "bg-rose-500",
        lastMessage: "Thanks for confirming! See you on Friday.",
        time: "Oct 22",
        unread: 0,
        route: "Baner → Kothrud",
        isOnline: false,
        isVerified: true,
        rideDate: "Oct 22",
    },
];

export default function MessagesInbox() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = conversations.filter(
        (c) =>
            c.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.route.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f111a] text-foreground transition-colors duration-500">
            {/* Sticky Header */}
            <nav className="sticky top-0 left-0 w-full z-50 bg-white/90 dark:bg-primary/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <span className="font-extrabold text-lg text-primary dark:text-white absolute left-1/2 -translate-x-1/2">
                        Messages
                    </span>
                    <button className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition">
                        <Plus size={20} />
                    </button>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-4 pt-6 pb-24">

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex items-center bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 mb-6 shadow-sm focus-within:ring-2 focus-within:ring-accent transition"
                >
                    <Search size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="bg-transparent w-full outline-none font-medium text-primary dark:text-white placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </motion.div>

                {/* Conversation List */}
                <AnimatePresence>
                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare size={28} className="text-gray-400" />
                            </div>
                            <h3 className="font-bold text-primary dark:text-white mb-1">No conversations yet</h3>
                            <p className="text-gray-500 text-sm">Messages with drivers will appear here after you book a ride.</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-2">
                            {filtered.map((conv, index) => (
                                <motion.div
                                    key={conv.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                >
                                    <Link
                                        href={`/messages/${conv.id}`}
                                        className="flex items-center gap-4 bg-white dark:bg-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-2xl p-4 transition group cursor-pointer"
                                    >
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <div className={`w-13 h-13 w-14 h-14 rounded-full ${conv.color} text-white flex items-center justify-center font-extrabold text-xl shadow-md`}>
                                                {conv.initial}
                                            </div>
                                            {conv.isOnline && (
                                                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-extrabold text-primary dark:text-white text-[15px]">
                                                        {conv.person}
                                                    </span>
                                                    {conv.isVerified && (
                                                        <ShieldCheck size={14} className="text-blue-500" strokeWidth={2.5} />
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium flex-shrink-0 ml-2">
                                                    {conv.time}
                                                </span>
                                            </div>

                                            <p className="text-sm text-accent font-semibold mb-1 truncate">
                                                {conv.route} · {conv.rideDate}
                                            </p>

                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm truncate ${conv.unread > 0 ? 'text-primary dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {conv.lastMessage}
                                                </p>
                                                {conv.unread > 0 && (
                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center">
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 flex items-start gap-3"
                >
                    <ShieldCheck size={20} className="text-blue-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div>
                        <p className="text-sm font-bold text-blue-700 dark:text-blue-400">End-to-End Protected</p>
                        <p className="text-xs text-blue-600/80 dark:text-blue-400/70 mt-0.5">Your personal contact info is never shared directly. All communication is routed through GatiSathi for your safety.</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
