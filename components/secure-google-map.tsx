"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import type { School } from "@/lib/supabase"

interface SecureGoogleMapProps {
  school: School
  height?: string
  zoom?: number
}

// Create a simple fallback component that uses the pre-generated static map URL
function StaticMapFallback({ school, height }: { school: School, height: string }) {
  if (!school.static_map_url) {
    return (
      <div className="w-full overflow-hidden rounded-lg bg-red-50 text-red-600 flex items-center justify-center" style={{ height }}>
        No map available
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg" style={{ height }}>
      <img 
        src={school.static_map_url} 
        alt={`Map of ${school.address}`} 
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export function SecureGoogleMap({ school, height = "400px", zoom = 15 }: SecureGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const [mapRequested, setMapRequested] = useState(false)
  const [loading, setLoading] = useState(false)

  // If we don't have coordinates, use the fallback immediately
  useEffect(() => {
    if (!school.coordinates) {
      setUseFallback(true);
    }
  }, [school.coordinates]);

  useEffect(() => {
    if (!mapRequested || !school.coordinates) return;
    setLoading(true);
    
    // Check if we're running on the client side
    if (typeof window === 'undefined') {
      console.log("Not running on client side, skipping map load");
      setLoading(false);
      return;
    }

    // Set a timeout to use the fallback if the map doesn't load within 5 seconds
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        console.log("Map loading timeout exceeded, using fallback");
        setUseFallback(true);
        setLoading(false);
      }
    }, 5000);

    // Now load the map if we have an API key
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is missing");
      setError("Google Maps API key is missing. Please check environment variables.");
      setDebug("Environment variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined.");
      setUseFallback(true);
      setLoading(false);
      return;
    }
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    // Check if API key looks valid (not empty or placeholder)
    if (apiKey === "" || apiKey === "your_google_maps_api_key_here") {
      setError("Invalid Google Maps API key. Please set a valid key in environment variables.");
      setUseFallback(true);
      setLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader
      .load()
      .then((google) => {
        console.log("Google Maps API loaded successfully");
        setIsLoaded(true);
        setLoading(false);
        clearTimeout(timeoutId);

        if (mapRef.current && school.coordinates) {
          const map = new google.maps.Map(mapRef.current, {
            center: {
              lat: school.coordinates.lat,
              lng: school.coordinates.lng
            },
            zoom: zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });

          new google.maps.Marker({
            map,
            position: {
              lat: school.coordinates.lat,
              lng: school.coordinates.lng
            },
            title: school.name,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load Google Maps", err);
        setError(`Failed to load Google Maps: ${err.message}`);
        setDebug(`Error details: ${JSON.stringify(err)}`);
        setUseFallback(true);
        setLoading(false);
        clearTimeout(timeoutId);
      });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [school, zoom, isLoaded, mapRequested]);

  // If we need to use the fallback, show the static map
  if (useFallback) {
    return <StaticMapFallback school={school} height={height} />;
  }

  // Show the overlay button if map has not been requested yet
  if (!mapRequested) {
    return (
      <div className="w-full rounded-lg overflow-hidden relative" style={{ height }}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg text-lg transition"
            onClick={() => setMapRequested(true)}
            aria-label="Load interactive map"
          >
            Load Map
          </button>
        </div>
        {/* Show static map preview if available */}
        {school.static_map_url ? (
          <img 
            src={school.static_map_url} 
            alt={`Map of ${school.address}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" style={{ height }} />
        )}
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 flex flex-col items-center justify-center" style={{ height }}>
          <p className="font-medium">{error}</p>
          {debug && <p className="text-xs mt-2 text-red-500">{debug}</p>}
          {/* Show the address that was attempted */}
          <p className="text-xs mt-1">Address: {school.address}</p>
          {/* Add a button to try the fallback */}
          <button 
            className="mt-3 bg-white border border-red-600 hover:bg-red-50 text-red-600 px-3 py-1 rounded text-sm"
            onClick={() => setUseFallback(true)}
          >
            Try Static Map
          </button>
        </div>
      ) : loading ? (
        <div className="bg-gray-100 flex items-center justify-center" style={{ height }}>
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !isLoaded ? (
        <div className="bg-gray-100 flex items-center justify-center" style={{ height }}>
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div ref={mapRef} style={{ height, width: "100%" }} />
      )}
    </div>
  );
} 