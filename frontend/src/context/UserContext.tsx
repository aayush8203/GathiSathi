"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
    _id: string;
    name?: string;
    phone?: string;
    email?: string;
    role: string;
    rating: number;
    totalTrips: number;
    isVerified: boolean;
    createdAt: string;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    isLoading: true,
    refreshUser: async () => { },
    logout: () => { },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                // Sync to localStorage for offline fallback
                localStorage.setItem("gatiSathiUser", JSON.stringify(data));
            } else {
                // Token might be expired 
                logout();
            }
        } catch {
            // Network error - try to restore from localStorage cache
            const cached = localStorage.getItem("gatiSathiUser");
            if (cached) {
                try { setUser(JSON.parse(cached)); } catch { /* */ }
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("gatiSathiUser");
        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <UserContext.Provider value={{ user, isLoading, refreshUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}

/** Returns the first letter(s) of the user's display name or identifier */
export function getUserInitial(user: { name?: string; phone?: string; email?: string } | null): string {
    if (!user) return "U";
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    if (user.phone) return user.phone.replace("+", "").charAt(0);
    return "U";
}

/** Returns shortened display name */
export function getUserDisplayName(user: { name?: string; phone?: string; email?: string } | null): string {
    if (!user) return "User";
    if (user.name) return user.name.split(" ")[0];
    if (user.email) return user.email.split("@")[0];
    if (user.phone) return user.phone;
    return "User";
}
