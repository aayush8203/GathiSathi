"use client";

import React, { useState, useCallback, useRef } from "react";
import { MapPin, Navigation, Map } from "lucide-react";

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

// Fallback map placeholder shown when no valid API key is configured
function MapPlaceholder({ vehicleType }: { vehicleType: "car" | "bike" }) {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const accentColor = vehicleType === "bike" ? "#FF7675" : "#3b82f6";

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Search Bar (non-functional without API key) */}
            <div className="flex flex-col lg:flex-row gap-3 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex-1 relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                    <MapPin size={18} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Origin"
                        value={origin}
                        onChange={e => setOrigin(e.target.value)}
                        className="bg-transparent w-full outline-none text-primary dark:text-white placeholder:text-gray-400 font-bold"
                    />
                </div>
                <div className="flex-1 relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                    <MapPin size={18} style={{ color: accentColor }} className="mr-2" />
                    <input
                        type="text"
                        placeholder="Destination"
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                        className="bg-transparent w-full outline-none text-primary dark:text-white placeholder:text-gray-400 font-bold"
                    />
                </div>
                <button className="bg-primary hover:bg-gray-800 text-white dark:bg-white dark:text-primary dark:hover:bg-gray-200 px-6 py-3 rounded-xl font-bold transition active:scale-95 whitespace-nowrap">
                    View Route
                </button>
            </div>

            {/* Stylised Static Placeholder Map */}
            <div className="relative w-full h-[500px] rounded-[16px] overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
                {/* Decorative grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-5" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Decorative road lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 250 Q 200 180 400 250 T 800 220" stroke="#6b7280" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <path d="M 0 300 Q 300 350 600 280 T 1034 320" stroke="#6b7280" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M 200 0 Q 220 200 180 400 T 240 605" stroke="#6b7280" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M 600 0 Q 580 150 620 300 T 560 605" stroke="#6b7280" strokeWidth="4" fill="none" strokeLinecap="round" />
                    {/* Animated route path */}
                    <path
                        d="M 100 400 Q 300 200 600 250 T 900 150"
                        stroke={accentColor}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="12 6"
                        opacity="0.7"
                    />
                    {/* Origin dot */}
                    <circle cx="100" cy="400" r="10" fill={accentColor} opacity="0.9" />
                    <circle cx="100" cy="400" r="18" fill={accentColor} opacity="0.2" />
                    {/* Destination dot */}
                    <circle cx="900" cy="150" r="10" fill="#10b981" opacity="0.9" />
                    <circle cx="900" cy="150" r="18" fill="#10b981" opacity="0.2" />
                </svg>

                {/* Center message */}
                <div className="relative z-10 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-8 py-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                    <Map size={32} className="mx-auto mb-3 text-gray-400" />
                    <p className="font-bold text-primary dark:text-white text-lg">Interactive Map</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                        Add your Google Maps API key in Vercel environment variables to enable live route tracking.
                    </p>
                    <a
                        href="https://console.cloud.google.com/google/maps-apis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs font-semibold text-blue-500 hover:text-blue-600 underline"
                    >
                        Get API Key →
                    </a>
                </div>

                {/* Corner decorations */}
                <div style={{ backgroundColor: accentColor }} className="absolute top-4 left-4 w-3 h-3 rounded-full opacity-60" />
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500 opacity-60" />
            </div>
        </div>
    );
}

export default function GatiMap({ vehicleType = "car", onRouteFound }: GatiMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // If no valid API key, show the fallback placeholder — avoids ApiProjectMapError
    if (!apiKey || apiKey === "ENTER_YOUR_API_KEY_HERE" || apiKey.length < 10) {
        return <MapPlaceholder vehicleType={vehicleType} />;
    }

    // Lazy-load the heavy Google Maps components only when a real API key is present
    return <GatiMapFull vehicleType={vehicleType} onRouteFound={onRouteFound} apiKey={apiKey} />;
}

// Full Google Maps component — only rendered when a valid API key is available
function GatiMapFull({ vehicleType, onRouteFound, apiKey }: GatiMapProps & { apiKey: string }) {
    // Dynamic import to avoid loading Google Maps SDK when key is missing
    const { useJsApiLoader, GoogleMap, DirectionsRenderer, Autocomplete, Marker } =
        require("@react-google-maps/api");

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES,
    });

    const [map, setMap] = useState<any>(null);
    const [directionsResponse, setDirectionsResponse] = useState<any>(null);
    const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 });
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");

    const originRef = useRef<HTMLInputElement>(null);
    const destRef = useRef<HTMLInputElement>(null);

    const onLoadMap = useCallback((mapInstance: any) => setMap(mapInstance), []);
    const onUnmountMap = useCallback(() => setMap(null), []);

    const locateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentPos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setCenter(currentPos);
                    if (map) { map.panTo(currentPos); map.setZoom(15); }
                },
                () => alert("Could not fetch location. Please enable location services.")
            );
        }
    };

    const calculateRoute = async () => {
        if (!originRef.current?.value || !destRef.current?.value) return;
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
                onRouteFound(results.routes[0].legs[0].distance?.text || "", results.routes[0].legs[0].duration?.text || "");
            }
        } catch (error) { console.error("Directions error:", error); }
    };

    if (!isLoaded) {
        return (
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-2xl animate-pulse">
                <span className="text-gray-500 font-bold">Loading Maps...</span>
            </div>
        );
    }

    const strokeColor = vehicleType === "bike" ? "#FF7675" : "#3b82f6";

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col lg:flex-row gap-3 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative z-10">
                <div className="flex-1 relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                    <MapPin size={18} className="text-gray-400 mr-2" />
                    <Autocomplete className="w-full">
                        <input type="text" placeholder="Origin" ref={originRef}
                            className="bg-transparent w-full outline-none text-primary dark:text-white placeholder:text-gray-400 font-bold" />
                    </Autocomplete>
                </div>
                <div className="flex-1 relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                    <MapPin size={18} className="text-accent mr-2" />
                    <Autocomplete className="w-full">
                        <input type="text" placeholder="Destination" ref={destRef}
                            className="bg-transparent w-full outline-none text-primary dark:text-white placeholder:text-gray-400 font-bold" />
                    </Autocomplete>
                </div>
                <button onClick={calculateRoute}
                    className="bg-primary hover:bg-gray-800 text-white dark:bg-white dark:text-primary dark:hover:bg-gray-200 px-6 py-3 rounded-xl font-bold transition active:scale-95 whitespace-nowrap">
                    View Route
                </button>
            </div>

            <div className="relative w-full h-[500px] rounded-[16px] overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={5}
                    onLoad={onLoadMap} onUnmount={onUnmountMap}
                    options={{ styles: darkMapTheme, disableDefaultUI: true, zoomControl: true, fullscreenControl: true }}>
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse}
                            options={{ polylineOptions: { strokeColor, strokeWeight: 6, strokeOpacity: 0.8 } }} />
                    )}
                    {!directionsResponse && (
                        <Marker position={center}
                            icon={{
                                path: vehicleType === "bike" ? google.maps.SymbolPath.CIRCLE : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                fillColor: vehicleType === "bike" ? "#FF7675" : "#3b82f6",
                                fillOpacity: 1, strokeWeight: 2, strokeColor: "#ffffff",
                                scale: vehicleType === "bike" ? 10 : 6
                            }} />
                    )}
                </GoogleMap>

                <button onClick={locateMe}
                    className="absolute bottom-6 right-6 bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-primary dark:text-white hover:text-accent dark:hover:text-accent transition active:scale-95 group"
                    title="Locate Me">
                    <Navigation size={22} className="group-hover:rotate-45 transition-transform" />
                </button>

                {distance && duration && (
                    <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                        <p className="text-primary dark:text-white font-extrabold text-lg flex items-center gap-2">
                            {distance} <span className="text-sm font-semibold text-gray-400">({duration})</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
