"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "@googlemaps/js-api-loader"
import { supabase } from "@/lib/supabase"
import type { School } from "@/lib/supabase"
import { slugify } from "@/lib/utils"

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapRequested, setMapRequested] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!mapRequested || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setError("Google Maps API key is missing")
      return
    }

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    })

    async function loadMap() {
      try {
        const google = await loader.load()
        setIsLoaded(true)

        if (mapRef.current) {
          // Center on US
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 39.8283, lng: -98.5795 },
            zoom: 4,
            mapTypeControl: false,
          })

          // Fetch schools
          const { data: schools, error } = await supabase.from("schools").select("*")

          if (error) {
            throw error
          }

          const infoWindow = new google.maps.InfoWindow()

          // Add markers for each school
          schools?.forEach((school: School) => {
            if (!school.coordinates) return;

            const marker = new google.maps.Marker({
              map,
              position: {
                lat: school.coordinates.lat,
                lng: school.coordinates.lng
              },
              title: school.name,
            })

            marker.addListener("click", () => {
              // Create city slug from the city name
              const citySlug = slugify(school.city)
              // Use state_abbr in lowercase for URL
              const stateAbbr = school.state_abbr.toLowerCase()
              
              const content = `
                <div class="p-2">
                  <h3 class="font-bold text-lg">${school.name}</h3>
                  <p class="text-sm">${school.city}, ${school.state_abbr}</p>
                  <a 
                    href="/schools/${stateAbbr}/${citySlug}/${school.slug}" 
                    class="text-emerald-600 hover:text-emerald-700 text-sm mt-2 inline-block"
                  >
                    View Details
                  </a>
                </div>
              `
              infoWindow.setContent(content)
              infoWindow.open(map, marker)
            })
          })
        }
      } catch (err: any) {
        setError(`Failed to load map: ${err.message}`)
      }
    }

    loadMap()
  }, [mapRequested])

  if (error) {
    return <div className="h-full flex items-center justify-center bg-red-50 text-red-600 p-4">{error}</div>
  }

  if (!mapRequested) {
    return (
      <div className="h-[600px] border rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg text-lg transition"
            onClick={() => setMapRequested(true)}
            aria-label="Load interactive map"
          >
            Load Map
          </button>
        </div>
        <div className="w-full h-full bg-gray-100" />
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <div ref={mapRef} className="h-[600px] w-full" />
}
