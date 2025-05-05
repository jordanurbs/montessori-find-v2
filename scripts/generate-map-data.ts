import { createClient } from "@supabase/supabase-js"
import type { School } from "@/lib/supabase"
import { Client } from "@googlemaps/google-maps-services-js"

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials:")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗")
  console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✓" : "✗")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Initialize Google Maps client
const client = new Client({})

// Function to geocode an address
async function geocodeAddress(address: string) {
  try {
    const response = await client.geocode({
      params: {
        address,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      },
    })

    if (response.data.status === "OK" && response.data.results[0]) {
      const result = response.data.results[0]
      return {
        formatted_address: result.formatted_address,
        geometry: result.geometry,
        place_id: result.place_id,
        types: result.types,
      }
    }
    return null
  } catch (error) {
    console.error(`Error geocoding address ${address}:`, error)
    return null
  }
}

// Function to generate a static map URL
function generateStaticMapUrl(lat: number, lng: number, schoolName: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const size = "600x400"
  const zoom = 15
  const marker = `color:red|label:S|${lat},${lng}`
  
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&markers=${marker}&key=${apiKey}`
}

// Main function to process all schools
async function generateMapData() {
  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set")
    process.exit(1)
  }

  // Get total count of schools that need processing
  const { count: totalToProcess, error: countError } = await supabase
    .from("schools")
    .select("*", { count: "exact", head: true })
    .is("coordinates", null)
    .not("address", "is", null)

  if (countError) {
    console.error("Error getting schools count:", countError)
    process.exit(1)
  }

  if (!totalToProcess) {
    console.error("No schools found to process")
    process.exit(1)
  }

  console.log(`Found ${totalToProcess} schools to process`)

  let processed = 0
  const batchSize = 50 // Reduced batch size for better reliability
  let successCount = 0
  let errorCount = 0

  // Process schools in batches
  for (let offset = 0; offset < totalToProcess; offset += batchSize) {
    console.log(`\nProcessing batch ${Math.floor(offset / batchSize) + 1} of ${Math.ceil(totalToProcess / batchSize)}`)
    console.log(`Progress: ${processed} of ${totalToProcess} (${((processed / totalToProcess) * 100).toFixed(1)}%)`)
    
    // Fetch schools for this batch
    const { data: schools, error: fetchError } = await supabase
      .from("schools")
      .select("*")
      .is("coordinates", null)
      .not("address", "is", null)
      .range(offset, offset + batchSize - 1)

    if (fetchError) {
      console.error("Error fetching schools batch:", fetchError)
      continue
    }

    if (!schools || schools.length === 0) {
      console.error("No schools found in batch")
      continue
    }

    // Process each school in the batch
    for (const school of schools) {
      console.log(`\nProcessing school: ${school.name}`)
      console.log(`Address: ${school.address}`)
      
      try {
        // Geocode the address
        const geocodeData = await geocodeAddress(school.address)
        if (!geocodeData) {
          console.error(`Failed to geocode address for ${school.name}`)
          errorCount++
          continue
        }

        // Extract coordinates
        const { lat, lng } = geocodeData.geometry.location
        const coordinates = { lat, lng }

        // Generate static map URL
        const staticMapUrl = generateStaticMapUrl(lat, lng, school.name)

        // Update the school record
        const { error: updateError } = await supabase
          .from("schools")
          .update({
            geocode_data: geocodeData,
            coordinates,
            static_map_url: staticMapUrl,
          })
          .eq("id", school.id)

        if (updateError) {
          console.error(`Error updating ${school.name}:`, updateError)
          errorCount++
        } else {
          console.log(`Successfully updated ${school.name}`)
          successCount++
        }
      } catch (error) {
        console.error(`Exception processing ${school.name}:`, error)
        errorCount++
      }

      processed++

      // Add a small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Print progress
    console.log(`\nBatch complete. Overall progress:`)
    console.log(`- Processed: ${processed} of ${totalToProcess} (${((processed / totalToProcess) * 100).toFixed(1)}%)`)
    console.log(`- Successful: ${successCount}`)
    console.log(`- Errors: ${errorCount}`)

    // Add a longer delay between batches
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log("\nMap data generation complete!")
  console.log(`Final results:`)
  console.log(`- Total processed: ${processed}`)
  console.log(`- Successful: ${successCount}`)
  console.log(`- Errors: ${errorCount}`)
}

// Run the script
generateMapData().catch(error => {
  console.error("Fatal error:", error)
  process.exit(1)
}) 