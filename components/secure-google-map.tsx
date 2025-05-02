"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface SecureGoogleMapProps {
  address: string
  height?: string
  zoom?: number
  markerTitle?: string
}

// Create a simple fallback component that uses an iframe embed
function StaticMapFallback({ address, height }: { address: string, height: string }) {
  // URL encode the address for use in the Netlify function
  const encodedAddress = encodeURIComponent(address);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get static map URL from our Netlify function proxy
    const zoom = 15;
    fetch(`/.netlify/functions/google-maps-proxy?endpoint=staticmap&address=${encodedAddress}&zoom=${zoom}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch static map');
        }
        // Response can be used directly as image source
        return response.url;
      })
      .then(url => {
        setMapUrl(url);
      })
      .catch(err => {
        console.error('Error fetching static map:', err);
        setError(err.message);
      });
  }, [encodedAddress]);

  if (error) {
    return (
      <div className="w-full overflow-hidden rounded-lg bg-red-50 text-red-600 flex items-center justify-center" style={{ height }}>
        Failed to load map: {error}
      </div>
    );
  }

  if (!mapUrl) {
    return (
      <div className="w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg" style={{ height }}>
      <img 
        src={mapUrl} 
        alt={`Map of ${address}`} 
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export function SecureGoogleMap({ address, height = "400px", zoom = 15, markerTitle }: SecureGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const [geocodeData, setGeocodeData] = useState<any>(null)
  const [mapRequested, setMapRequested] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!mapRequested) return;
    setLoading(true);
    // Add console logging for debugging
    console.log("SecureGoogleMap component mounted", { address, zoom, markerTitle })
    
    // Check if we're running on the client side
    if (typeof window === 'undefined') {
      console.log("Not running on client side, skipping map load");
      setLoading(false);
      return;
    }

    // First, fetch geocode data from our Netlify function proxy
    const fetchGeocodeData = async () => {
      try {
        if (!address) {
          setError("No address provided");
          setUseFallback(true);
          setLoading(false);
          return;
        }

        console.log("Geocoding address via proxy:", address);
        
        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(`/.netlify/functions/google-maps-proxy?endpoint=geocode&address=${encodedAddress}`);
        
        if (!response.ok) {
          throw new Error(`Geocoding API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Geocode result from proxy:", data);
        
        if (data.status === "OK" && data.results && data.results[0]) {
          setGeocodeData(data.results[0]);
        } else {
          throw new Error(`Geocoding failed: ${data.status}`);
        }
      } catch (err: any) {
        console.error("Failed to geocode address:", err);
        setError(`Failed to geocode address: ${err.message}`);
        setDebug(`Address: "${address}", Error: ${err.message}`);
        setUseFallback(true);
        setLoading(false);
      }
    };

    // Set a timeout to use the fallback if the map doesn't load within 5 seconds
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        console.log("Map loading timeout exceeded, using fallback");
        setUseFallback(true);
        setLoading(false);
      }
    }, 5000);

    // First fetch the geocode data
    fetchGeocodeData();

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

        if (mapRef.current && geocodeData) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 0, lng: 0 },
            zoom: zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });

          // Use the geocoded data to center the map and add marker
          const location = geocodeData.geometry.location;
          map.setCenter({
            lat: location.lat,
            lng: location.lng
          });

          new google.maps.Marker({
            map,
            position: {
              lat: location.lat,
              lng: location.lng
            },
            title: markerTitle || address,
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
  }, [address, zoom, markerTitle, isLoaded, geocodeData, mapRequested]);

  // If we need to use the fallback and we have an address, show the static map
  if (useFallback && address) {
    return <StaticMapFallback address={address} height={height} />;
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
        {/* No static map preview here, just a blank placeholder */}
        <div className="w-full h-full bg-gray-100" style={{ height }} />
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {error && !useFallback ? (
        <div className="bg-red-50 text-red-600 p-4 flex flex-col items-center justify-center" style={{ height }}>
          <p className="font-medium">{error}</p>
          {debug && <p className="text-xs mt-2 text-red-500">{debug}</p>}
          {/* Show the address that was attempted */}
          {address && <p className="text-xs mt-1">Address: {address}</p>}
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
      ) : !isLoaded && !useFallback ? (
        <div className="bg-gray-100 flex items-center justify-center" style={{ height }}>
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div ref={mapRef} style={{ height, width: "100%" }} />
      )}
    </div>
  );
} 