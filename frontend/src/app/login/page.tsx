"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    ArrowRight,
    Phone,
    MessageSquareDot,
    CheckCircle2,
    RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";

const TRANSLATIONS: Record<string, any> = {
    EN: {
        stepPhone: "Enter your phone or email to continue.",
        stepOtp: "We sent a code to you.",
        placeholder: "Mobile Number or Email",
        getOtp: "Get OTP",
        changePhone: "Change Phone Number",
        verifyBtn: "Verify & Login",
        terms: "By continuing, you agree to our Terms & Privacy Policy.",
        loginFailed: "Login failed",
        serverError: "Could not connect to server. Ensure backend is running!",
    },
    HI: {
        stepPhone: "जारी रखने के लिए अपना फ़ोन या ईमेल दर्ज करें।",
        stepOtp: "हमने आपको एक कोड भेजा है।",
        placeholder: "मोबाइल नंबर या ईमेल",
        getOtp: "OTP प्राप्त करें",
        changePhone: "फ़ोन नंबर बदलें",
        verifyBtn: "सत्यापित करें और लॉगिन करें",
        terms: "जारी रखते हुए, आप हमारी शर्तों और गोपनीयता नीति से सहमत होते हैं।",
        loginFailed: "लॉगिन विफल",
        serverError: "सर्वर से कनेक्ट नहीं हो सका।",
    }
};

export default function LoginPage() {
    const router = useRouter();

    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [contactMethod, setContactMethod] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);

    const t = TRANSLATIONS["EN"];
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (contactMethod.length < 5) return;

        setIsLoading(true);
        // Simulate API sending OTP
        setTimeout(() => {
            setIsLoading(false);
            setStep("otp");
        }, 1500);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < 4) return;

        setIsLoading(true);
        try {
            const isEmail = contactMethod.includes("@");
            const payload = isEmail ? { email: contactMethod } : { phone: contactMethod };

            const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                // Lock token in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('gatiSathiUser', JSON.stringify(data.user));

                router.push("/home");
            } else {
                alert(data.msg || t.loginFailed);
            }
        } catch (error) {
            console.error("Login Check Error:", error);
            alert(t.serverError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multi-char paste for simplicity
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
            if (prevInput) prevInput.focus();
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">



            {/* Background Map Image */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute inset-0 bg-white/50 dark:bg-primary/80 z-10 transition-colors duration-300"></div>
                <img
                    src="/landing_map_bg.png"
                    alt="Map Background"
                    className="w-full h-full object-cover opacity-80 filter grayscale mix-blend-multiply dark:mix-blend-lighten"
                />
            </div>

            {/* Auth Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white dark:bg-gray-900 shadow-[0_8px_40px_rgb(0,0,0,0.12)] rounded-[32px] p-8 md:p-10 border border-gray-100 dark:border-gray-800 backdrop-blur-xl">

                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <img src="/logo.png" alt="GatiSathi Logo" className="w-56 sm:w-64 h-auto object-contain mb-6 dark:invert dark:hue-rotate-180 dark:brightness-150 dark:contrast-125 drop-shadow-sm transition-all" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
                            {step === "phone" ? t.stepPhone : t.stepOtp}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === "phone" ? (
                            <motion.form
                                key="phone-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSendOtp}
                                className="space-y-6"
                            >
                                <div className="relative flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-accent transition">
                                    <div className="flex items-center gap-2 border-r border-gray-200 dark:border-gray-700 pr-3 mr-3">
                                        <ShieldCheck className="text-gray-500 font-bold" size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder={t.placeholder}
                                        className="bg-transparent w-full outline-none font-bold tracking-wide text-lg text-primary dark:text-white placeholder:text-gray-400 placeholder:font-medium placeholder:tracking-normal"
                                        value={contactMethod}
                                        onChange={(e) => setContactMethod(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || contactMethod.length < 5}
                                    className="w-full bg-accent hover:bg-accent-hover disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:text-gray-500 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-accent/30 transition-all active:scale-95"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {t.getOtp}
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="otp-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleVerifyOtp}
                                className="space-y-6"
                            >
                                <div className="flex justify-between gap-3 px-2">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value.replace(/[^0-9]/g, ''))}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                            className="w-14 h-16 text-center text-2xl font-extrabold bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-accent outline-none text-primary dark:text-white transition-all shadow-sm"
                                        />
                                    ))}
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep("phone")}
                                        className="text-sm font-semibold text-accent hover:text-accent-hover flex items-center justify-center gap-1 mx-auto transition-colors"
                                    >
                                        <RefreshCw size={14} /> {t.changePhone}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || otp.join("").length < 4}
                                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:text-gray-500 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-500/30 transition-all active:scale-95"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {t.verifyBtn}
                                            <CheckCircle2 size={20} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 py-3 rounded-full backdrop-blur-md border border-gray-200 dark:border-gray-800/60 inline-block px-6 relative left-1/2 -translate-x-1/2">
                    {t.terms}
                </div>
            </motion.div>
        </div>
    );
}
