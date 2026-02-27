"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    Camera,
    Mail,
    Phone,
    User,
    ShieldCheck,
    Save,
    CheckCircle2,
    Loader2,
    Star,
    Hash,
    AlertCircle
} from "lucide-react";
import { useUser, getUserDisplayName } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, isLoading, refreshUser } = useUser();
    const router = useRouter();

    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !localStorage.getItem("token")) {
            router.push("/login");
        }
    }, [isLoading, router]);

    // Populate form with real user data
    useEffect(() => {
        if (user) {
            setName(user.name || "");
        }
    }, [user]);

    // Simulated image upload handler
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveStatus("idle");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                await refreshUser(); // Update global user context
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
            }
        } catch {
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    const displayInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-20">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-primary/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-colors">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/home" className="flex items-center gap-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-semibold hidden sm:block">Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold select-none absolute left-1/2 -translate-x-1/2 -my-4">
                        <img src="/logo.png" alt="GatiSathi Logo" className="h-20 sm:h-24 md:h-28 w-auto object-contain dark:invert dark:hue-rotate-180 dark:brightness-150 dark:contrast-125 drop-shadow-sm transition-all" />
                        <span className="text-xl tracking-tight hidden sm:block">Profile</span>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 shadow-md shadow-accent/20"
                    >
                        {isSaving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : saveStatus === "success" ? (
                            <CheckCircle2 size={18} />
                        ) : saveStatus === "error" ? (
                            <AlertCircle size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        <span className="hidden sm:block">
                            {isSaving ? "Saving..." : saveStatus === "success" ? "Saved!" : saveStatus === "error" ? "Error" : "Save"}
                        </span>
                    </button>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-4 pt-24">

                {/* Stats Bar */}
                {user && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-3 gap-3 mb-6"
                    >
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-4 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                <span className="font-extrabold text-lg text-primary dark:text-white">{user.rating.toFixed(1)}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold">Rating</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-4 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Hash size={16} className="text-accent" />
                                <span className="font-extrabold text-lg text-primary dark:text-white">{user.totalTrips}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold">Trips</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-4 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <ShieldCheck size={16} className={user.isVerified ? "text-blue-500" : "text-gray-400"} />
                                <span className={`font-extrabold text-sm ${user.isVerified ? "text-blue-500" : "text-gray-400"}`}>
                                    {user.isVerified ? "Verified" : "Pending"}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold">Status</p>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800/50 rounded-[32px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-primary dark:text-white mb-2">Manage Profile</h1>
                        <p className="text-gray-500 dark:text-gray-400">Update your rider details and preferences.</p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-8">

                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center">
                            <div className="relative group cursor-pointer">
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-accent flex items-center justify-center relative">
                                    {profilePic ? (
                                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-extrabold text-5xl">{displayInitial}</span>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={28} className="text-white" />
                                    </div>
                                </div>

                                {/* File Input */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    title="Upload profile picture"
                                />

                                <div className="absolute bottom-0 right-0 w-10 h-10 bg-accent text-white rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-md">
                                    <Camera size={16} />
                                </div>
                            </div>
                            <p className="mt-4 text-sm font-semibold text-accent">Tap to change picture</p>
                        </div>

                        <hr className="border-gray-100 dark:border-gray-700/50" />

                        {/* Form Fields */}
                        <div className="space-y-5">

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                                <div className="relative flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
                                    <User className="text-gray-400 mr-3 flex-shrink-0" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your complete name"
                                        className="bg-transparent w-full outline-none font-medium text-primary dark:text-white"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {user?.phone && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 flex items-center justify-between">
                                        <span>Phone Number</span>
                                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={12} /> Verified</span>
                                    </label>
                                    <div className="relative flex items-center bg-gray-50 dark:bg-gray-900/50 opacity-70 cursor-not-allowed rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 transition">
                                        <Phone className="text-gray-400 mr-3 flex-shrink-0" size={20} />
                                        <input
                                            type="text"
                                            disabled
                                            className="bg-transparent w-full outline-none font-medium text-primary dark:text-white cursor-not-allowed"
                                            value={user.phone}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 ml-1">Phone number is linked to your account directly.</p>
                                </div>
                            )}

                            {user?.email && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                                    <div className="relative flex items-center bg-gray-50 dark:bg-gray-900/50 opacity-70 cursor-not-allowed rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 transition">
                                        <Mail className="text-gray-400 mr-3 flex-shrink-0" size={20} />
                                        <input
                                            type="email"
                                            disabled
                                            className="bg-transparent w-full outline-none font-medium text-primary dark:text-white cursor-not-allowed"
                                            value={user.email}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 ml-1">Email is linked to your account and cannot be changed.</p>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">About You</label>
                                <div className="relative flex bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-accent transition">
                                    <textarea
                                        rows={4}
                                        placeholder="Tell your co-riders a bit about yourself... (e.g. 'I love music and good conversations!')"
                                        className="bg-transparent w-full outline-none font-medium text-primary dark:text-white placeholder:text-gray-400 resize-none"
                                        value={about}
                                        onChange={(e) => setAbout(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 ml-1">Note: About section is saved locally for now.</p>
                            </div>

                        </div>
                    </form>
                </motion.div>
            </main>

            {/* Decorative Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-300/20 dark:bg-gray-800/40 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />
            </div>
        </div>
    );
}
