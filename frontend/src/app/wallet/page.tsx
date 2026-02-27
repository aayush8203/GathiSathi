"use client";

import React, { useState } from "react";
import { ArrowLeft, Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Clock, Building2, Plus, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Wallet() {
    const router = useRouter();

    const stats = {
        balance: 2450.00,
        earningsThisMonth: 1850.00,
        pending: 300.00
    };

    const transactions = [
        { id: "TXN-010", type: "credit", title: "Ride from Delhi to Jaipur", date: "Today, 02:30 PM", amount: 450.00, status: "completed" },
        { id: "TXN-009", type: "debit", title: "Withdrawal to HDFC Bank", date: "Yesterday, 09:15 AM", amount: 1500.00, status: "completed" },
        { id: "TXN-008", type: "credit", title: "Ride from Gurgaon to Noida", date: "Oct 24, 06:00 PM", amount: 300.00, status: "pending" },
        { id: "TXN-007", type: "debit", title: "Added Funds via UPI", date: "Oct 22, 11:45 AM", amount: 500.00, status: "completed" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background text-foreground transition-colors duration-500 pb-20">
            {/* Header */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-primary/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-colors">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400 focus:outline-none shrink-0">
                        <ArrowLeft size={20} />
                    </button>
                    <span className="font-bold text-lg text-primary dark:text-white absolute left-1/2 -translate-x-1/2 select-none">Wallet & Earnings</span>
                    <div className="w-10"></div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 pt-24 space-y-6">

                {/* Balance Card Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full rounded-[28px] overflow-hidden p-8 text-white shadow-xl shadow-accent/20"
                    style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)' }}
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-white/80 font-bold text-sm tracking-widest uppercase mb-1">Available Balance</h2>
                                <h1 className="text-5xl font-extrabold flex items-center gap-1">
                                    <span className="text-3xl text-white/80 font-medium">₹</span>
                                    {stats.balance.toFixed(2)}
                                </h1>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <WalletIcon size={28} className="text-white" strokeWidth={2.5} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full mt-4">
                            <button className="flex-1 bg-white hover:bg-gray-50 text-[#FF6B6B] py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
                                <Plus size={20} strokeWidth={3} /> Add Funds
                            </button>
                            <button className="flex-1 bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white border border-white/30 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                                <Building2 size={18} strokeWidth={2.5} /> Withdraw
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Lifetime Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col items-start">
                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center mb-3">
                            <ArrowUpRight size={20} strokeWidth={2.5} />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">Earnings this Month</p>
                        <p className="text-2xl font-extrabold text-primary dark:text-white mt-1">₹{stats.earningsThisMonth.toFixed(2)}</p>
                    </div>

                    <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col items-start cursor-pointer hover:border-gray-200 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-3">
                            <Clock size={20} strokeWidth={2.5} />
                        </div>
                        <div className="w-full flex justify-between items-start">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">Pending Clearance</p>
                            <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-2xl font-extrabold text-primary dark:text-white mt-1">₹{stats.pending.toFixed(2)}</p>
                    </div>
                </motion.div>

                {/* Transactions List */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-extrabold text-lg text-primary dark:text-white">Recent Transactions</h3>
                        <button className="text-accent text-sm font-bold hover:underline">View All</button>
                    </div>

                    <div className="space-y-5">
                        {transactions.map((txn, index) => (
                            <div key={txn.id} className={`flex items-center justify-between \${index !== transactions.length - 1 ? "pb-5 border-b border-gray-100 dark:border-gray-800/80" : ""}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center \${
                                        txn.type === 'credit' 
                                            ? 'bg-green-50 text-green-500 dark:bg-green-500/10' 
                                            : 'bg-red-50 text-red-500 dark:bg-red-500/10'
                                    }`}>
                                        {txn.type === 'credit' ? <ArrowDownRight size={22} strokeWidth={2.5} /> : <ArrowUpRight size={22} strokeWidth={2.5} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary dark:text-white leading-tight">{txn.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{txn.date}</span>
                                            {txn.status === 'pending' && (
                                                <span className="bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className={`block font-extrabold text-lg \${
                                        txn.type === 'credit' ? 'text-green-500' : 'text-primary dark:text-white'
                                    }`}>
                                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Linked Accounts */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm mb-12"
                >
                    <h3 className="font-extrabold text-lg text-primary dark:text-white mb-4">Payment Methods</h3>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-gray-300 cursor-pointer transition">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-primary dark:text-gray-300">
                                <Building2 size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary dark:text-white">HDFC Bank</h4>
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">•••• •••• 4598</span>
                            </div>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-md">
                            Primary
                        </div>
                    </div>

                    <button className="w-full mt-4 py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold hover:border-accent hover:text-accent hover:bg-accent/5 transition flex items-center justify-center gap-2">
                        <Plus size={20} /> Link New UPI or Bank
                    </button>
                </motion.div>

            </main>
        </div>
    );
}
