"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface GoogleMapProps {
  address: string
  height?: string
  zoom?: number
  markerTitle?: string
}

// Create a simple fallback component that uses an iframe embed
function StaticMapFallback({ address, height }: { address: string, height: string }) {
  // URL encode the address for use in the Google Maps embed URL
  const encodedAddress = encodeURIComponent(address)
  
  return (
    <div className="w-full overflow-hidden rounded-lg" style={{ height }}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCoVGUVbpBPAzLecFm1j1b1t4P0Cw6fN_I&q=${encodedAddress}`}
        allowFullScreen
      ></iframe>
    </div>
  )
}

export function GoogleMap({ address, height = "400px", zoom = 15, markerTitle }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    // Add console logging for debugging
    console.log("GoogleMap component mounted", { address, zoom, markerTitle })
    
    // Check if we're running on the client side
    if (typeof window === 'undefined') {
      console.log("Not running on client side, skipping map load");
      return;
    }
    
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is missing")
      setError("Google Maps API key is missing. Please check environment variables.")
      setDebug("Environment variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined.")
      setUseFallback(true)
      return
    }
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    console.log("Google Maps API key found", { keyLength: apiKey.length })
    
    // Check if API key looks valid (not empty or placeholder)
    if (apiKey === "" || apiKey === "your_google_maps_api_key_here") {
      setError("Invalid Google Maps API key. Please set a valid key in environment variables.")
      setUseFallback(true)
      return
    }

    // Set a timeout to use the fallback if the map doesn't load within 5 seconds
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        console.log("Map loading timeout exceeded, using fallback")
        setUseFallback(true)
      }
    }, 5000);

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    })

    loader
      .load()
      .then((google) => {
        console.log("Google Maps API loaded successfully")
        setIsLoaded(true)
        clearTimeout(timeoutId)

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 0, lng: 0 },
            zoom: zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          })

          if (!address) {
            setError("No address provided")
            setUseFallback(true)
            return
          }

          const geocoder = new google.maps.Geocoder()
          console.log("Geocoding address:", address)

          geocoder.geocode({ address }, (results: any, status: any) => {
            console.log("Geocode result", { status, resultsCount: results?.length })
            
            if (status === "OK" && results && results[0]) {
              const location = results[0].geometry.location
              map.setCenter(location)

              new google.maps.Marker({
                map,
                position: location,
                title: markerTitle || address,
              })
            } else {
              console.error("Geocoding failed", { status, address })
              setError(`Geocoding failed: ${status}`)
              setDebug(`Address: "${address}", Status: "${status}"`)
              setUseFallback(true)
            }
          })
        }
      })
      .catch((err) => {
        console.error("Failed to load Google Maps", err)
        setError(`Failed to load Google Maps: ${err.message}`)
        setDebug(`Error details: ${JSON.stringify(err)}`)
        setUseFallback(true)
        clearTimeout(timeoutId)
      })

    return () => {
      clearTimeout(timeoutId)
    }
  }, [address, zoom, markerTitle, isLoaded])

  // If we need to use the fallback and we have an address, show the static map
  if (useFallback && address) {
    return <StaticMapFallback address={address} height={height} />
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
      ) : !isLoaded && !useFallback ? (
        <div className="bg-gray-100 flex items-center justify-center" style={{ height }}>
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div ref={mapRef} style={{ height, width: "100%" }} />
      )}
    </div>
  )
}
