"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { ArrowLeft, Send, Phone, MoreVertical, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Chat personas by conversation ID for demo purposes
const chatData: Record<string, { name: string; initial: string; color: string; route: string; price: number; seatsLeft: number; messages: Array<{ id: number; sender: string; text: string; time: string }> }> = {
    "conv-1": {
        name: "Rakesh S.",
        initial: "R",
        color: "bg-accent",
        route: "Delhi → Jaipur",
        price: 450,
        seatsLeft: 2,
        messages: [
            { id: 1, sender: "driver", text: "Hi! Are you still looking for a ride from Delhi to Jaipur?", time: "10:30 AM" },
            { id: 2, sender: "user", text: "Yes! Is there still space for one?", time: "10:32 AM" },
            { id: 3, sender: "driver", text: "Yep, I have two seats left actually. Where do you want to get picked up?", time: "10:35 AM" },
        ]
    },
    "conv-2": {
        name: "Priya M.",
        initial: "P",
        color: "bg-purple-500",
        route: "Hinjewadi → SPPU",
        price: 80,
        seatsLeft: 1,
        messages: [
            { id: 1, sender: "driver", text: "Hello! I see you booked a seat on my Hinjewadi ride.", time: "7:00 AM" },
            { id: 2, sender: "user", text: "Yes, I'll be at the Hinjewadi Phase 1 gate.", time: "7:05 AM" },
            { id: 3, sender: "driver", text: "Okay, I'll be at MG Road Metro at 7:30 AM.", time: "7:10 AM" },
        ]
    },
};

const autoReplies = [
    "Sounds good! See you there! 👍",
    "Perfect, I'll keep a seat for you!",
    "Got it. I'll ping you when I'm 10 minutes away.",
    "No problem at all!",
    "Great, looking forward to the trip!",
];

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const chat = chatData[id] || chatData["conv-1"]; // Fallback to first chat

    const [messages, setMessages] = useState(chat.messages);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsgItem = {
            id: Date.now(),
            sender: "user",
            text: newMessage.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsgItem]);
        setNewMessage("");

        // Simulate driver typing and auto-replying
        setTimeout(() => {
            const replyMsg = {
                id: Date.now() + 1,
                sender: "driver",
                text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, replyMsg]);
        }, 1200 + Math.random() * 800);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f111a] flex flex-col transition-colors duration-500">
            {/* Header */}
            <nav className="sticky top-0 left-0 w-full z-50 bg-white/90 dark:bg-primary/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                <div className="max-w-2xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400 focus:outline-none shrink-0">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className={`w-12 h-12 ${chat.color} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm`}>
                                    {chat.initial}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-primary rounded-full"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-primary dark:text-white flex items-center gap-1.5 leading-tight">
                                    {chat.name} <ShieldCheck size={16} className="text-blue-500" strokeWidth={2.5} />
                                </span>
                                <span className="text-xs font-semibold text-accent">Active now</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none">
                            <Phone size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition focus:outline-none">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Chat Area */}
            <main className="flex-1 w-full max-w-2xl mx-auto p-4 overflow-y-auto space-y-6 pt-6 pb-32">
                <div className="text-center">
                    <span className="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                        Today
                    </span>
                </div>

                {/* Ride Summary Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between mx-auto w-full max-w-sm">
                    <div>
                        <p className="text-xs text-gray-500 font-bold mb-1">RIDE DETAILS</p>
                        <p className="text-sm font-bold text-primary dark:text-white">{chat.route}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-accent">₹{chat.price}</p>
                        <p className="text-xs text-gray-500">{chat.seatsLeft} Seats Left</p>
                    </div>
                </div>

                {messages.map((msg) => {
                    const isUser = msg.sender === "user";
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-[80%] md:max-w-[70%] rounded-[24px] px-5 py-3 shadow-sm ${isUser
                                    ? 'bg-accent text-white rounded-br-sm'
                                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-primary dark:text-gray-100 rounded-bl-sm'
                                }`}>
                                <p className="leading-relaxed text-[15px]">{msg.text}</p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 px-2">
                                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{msg.time}</span>
                                {isUser && <CheckCircle2 size={12} className="text-accent" />}
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-4 transition-colors">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message ${chat.name}...`}
                            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full pl-6 pr-14 py-4 focus:ring-2 focus:ring-accent outline-none text-primary dark:text-white placeholder-gray-400 shadow-inner text-[15px] font-medium transition-shadow"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-hover disabled:opacity-50 disabled:active:scale-100 transition shadow-sm active:scale-90"
                        >
                            <Send size={18} className="ml-1 -mt-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
