"use client";

import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Autocomplete, Marker } from "@react-google-maps/api";
import { Navigation, MapPin } from "lucide-react";

// Required libraries must be static to avoid re-renders
const LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

// Custom Dark Mode Theme for Maps (Deep Charcoal)
const darkMapTheme = [
    { elementType: "geometry", stylers: [{ color: "#2D3436" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#2D3436" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#3f484a" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2D3436" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4f5a5c" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#1c2022" }] },
];

const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "16px",
};

interface GatiMapProps {
    vehicleType?: "car" | "bike";
    onRouteFound?: (distance: string, duration: string) => void;
}

export default function GatiMap({ vehicleType = "car", onRouteFound }: GatiMapProps) {
    // Load Script
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default India

    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");

    const originRef = useRef<HTMLInputElement>(null);
    const destRef = useRef<HTMLInputElement>(null);

    const onLoadMap = useCallback(function callback(mapInstance: google.maps.Map) {
        setMap(mapInstance);
    }, []);

    const onUnmountMap = useCallback(function callback() {
        setMap(null);
    }, []);

    // 6. Location Features: Locate Me Button
    const locateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCenter(currentPos);
                    if (map) {
                        map.panTo(currentPos);
                        map.setZoom(15);
                    }
                },
                () => alert("Could not fetch location. Please enable location services.")
            );
        }
    };

    // Calculate Map Directions
    const calculateRoute = async () => {
        if (!originRef.current?.value || !destRef.current?.value) return;

        // Call Directions Service
        const directionsService = new window.google.maps.DirectionsService();
        try {
            const results = await directionsService.route({
                origin: originRef.current.value,
                destination: destRef.current.value,
                travelMode: google.maps.TravelMode.DRIVING,
            });

            setDirectionsResponse(results);
            setDistance(results.routes[0].legs[0].distance?.text || "");
            setDuration(results.routes[0].legs[0].duration?.text || "");

            if (onRouteFound) {
                onRouteFound(
                    results.routes[0].legs[0].distance?.text || "",
                    results.routes[0].legs[0].duration?.text || ""
                );
            }
        } catch (error) {
            console.error("Directions error:", error);
        }
    };

    if (!isLoaded) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-2xl animate-pulse">
                <span className="text-gray-500 font-bold">Loading Maps...</span>
            </div>
        );
    }

    // Define polyline colors based on active vehicle
    const strokeColor = vehicleType === "bike" ? "#FF7675" : "#3b82f6"; // Electric Orange or Blue

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Search Bar Interactive */}
            <div className="flex flex-col lg:flex-row gap-3 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative z-10">
                <div className="flex-1 relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                    <MapPin size={18} className="text-gray-400 mr-2" />
                    <Autocomplete className="w-full">
                        <input
                            type="text"
                            placeholder="Origin"
                            ref={originRef}
                            className="bg-transparent w-full outline-none text-primary dark:text-white placeholder:text-gray-400 font-bold"
                        />
                    </Autocomplete>
                </div>
                <div className="flex-1 relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                    <MapPin size={18} className="text-accent mr-2" />
                    <Autocomplete className="w-full">
                        <input
                            type="text"
                            placeholder="Destination"
                            ref={destRef}
                            className="bg-transparent w-full outline-none text-primary dark:text-white placeholder:text-gray-400 font-bold"
                        />
                    </Autocomplete>
                </div>
                <button
                    onClick={calculateRoute}
                    className="bg-primary hover:bg-gray-800 text-white dark:bg-white dark:text-primary dark:hover:bg-gray-200 px-6 py-3 rounded-xl font-bold transition active:scale-95 whitespace-nowrap"
                >
                    View Route
                </button>
            </div>

            {/* Map Rendering container */}
            <div className="relative w-full h-[500px] rounded-[16px] overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={5}
                    onLoad={onLoadMap}
                    onUnmount={onUnmountMap}
                    options={{
                        styles: darkMapTheme,
                        disableDefaultUI: true,
                        zoomControl: true,
                        fullscreenControl: true,
                    }}
                >
                    {directionsResponse && (
                        <DirectionsRenderer
                            directions={directionsResponse}
                            options={{
                                polylineOptions: {
                                    strokeColor: strokeColor,
                                    strokeWeight: 6,
                                    strokeOpacity: 0.8,
                                },
                            }}
                        />
                    )}

                    {/* Fallback Single Location Custom Marker if no directions set */}
                    {(!directionsResponse) && (
                        <Marker
                            position={center}
                            icon={{
                                path: vehicleType === "bike"
                                    ? google.maps.SymbolPath.CIRCLE
                                    : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                fillColor: vehicleType === "bike" ? "#FF7675" : "#3b82f6",
                                fillOpacity: 1,
                                strokeWeight: 2,
                                strokeColor: "#ffffff",
                                scale: vehicleType === "bike" ? 10 : 6
                            }}
                        />
                    )}
                </GoogleMap>

                {/* Locate Me Button Overlay */}
                <button
                    onClick={locateMe}
                    className="absolute bottom-6 right-6 bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-primary dark:text-white hover:text-accent dark:hover:text-accent transition active:scale-95 group"
                    title="Locate Me"
                >
                    <Navigation size={22} className="group-hover:rotate-45 transition-transform" />
                </button>

                {/* Floating Distance Data */}
                {distance && duration && (
                    <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                        <p className="text-primary dark:text-white font-extrabold text-lg flex items-center gap-2">
                            {distance}
                            <span className="text-sm font-semibold text-gray-400">({duration})</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
