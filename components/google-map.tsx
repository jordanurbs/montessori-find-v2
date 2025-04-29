"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface GoogleMapProps {
  address: string
  height?: string
  zoom?: number
  markerTitle?: string
}

export function GoogleMap({ address, height = "400px", zoom = 15, markerTitle }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setError("Google Maps API key is missing")
      return
    }

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    })

    loader
      .load()
      .then((google) => {
        setIsLoaded(true)

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 0, lng: 0 },
            zoom: zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          })

          const geocoder = new google.maps.Geocoder()

          geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const location = results[0].geometry.location
              map.setCenter(location)

              new google.maps.Marker({
                map,
                position: location,
                title: markerTitle || address,
              })
            } else {
              setError(`Geocoding failed: ${status}`)
            }
          })
        }
      })
      .catch((err) => {
        setError(`Failed to load Google Maps: ${err.message}`)
      })
  }, [address, zoom, markerTitle])

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 flex items-center justify-center" style={{ height }}>
          {error}
        </div>
      ) : !isLoaded ? (
        <div className="bg-gray-100 flex items-center justify-center" style={{ height }}>
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div ref={mapRef} style={{ height, width: "100%" }} />
      )}
    </div>
  )
}
