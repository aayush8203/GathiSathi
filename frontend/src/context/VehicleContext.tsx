"use client";

import React, { createContext, useContext, useState } from "react";

type VehicleType = "car" | "bike";

interface VehicleContextType {
    vehicleType: VehicleType;
    setVehicleType: (type: VehicleType) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
    const [vehicleType, setVehicleType] = useState<VehicleType>("car");

    return (
        <VehicleContext.Provider value={{ vehicleType, setVehicleType }}>
            {children}
        </VehicleContext.Provider>
    );
}

export function useVehicle() {
    const context = useContext(VehicleContext);
    if (context === undefined) {
        throw new Error("useVehicle must be used within a VehicleProvider");
    }
    return context;
}
