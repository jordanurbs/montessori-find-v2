import { createClient } from "@supabase/supabase-js"
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

async function verifyMapData() {
  // Get total count of schools
  const { count: totalSchools } = await supabase
    .from("schools")
    .select("*", { count: "exact", head: true })

  if (!totalSchools) {
    console.error("No schools found in database")
    process.exit(1)
  }

  // Get counts of schools with map data
  const { count: schoolsWithCoordinates } = await supabase
    .from("schools")
    .select("*", { count: "exact", head: true })
    .not("coordinates", "is", null)

  const { count: schoolsWithStaticMaps } = await supabase
    .from("schools")
    .select("*", { count: "exact", head: true })
    .not("static_map_url", "is", null)

  const { count: schoolsWithGeocodeData } = await supabase
    .from("schools")
    .select("*", { count: "exact", head: true })
    .not("geocode_data", "is", null)

  // Get all schools missing map data
  const { data: schoolsMissingData, error: fetchError } = await supabase
    .from("schools")
    .select("*")
    .is("coordinates", null)
    .order("created_at", { ascending: false })

  if (fetchError) {
    console.error("Error fetching schools:", fetchError)
    process.exit(1)
  }

  if (!schoolsMissingData) {
    console.error("No schools found")
    process.exit(1)
  }

  // Print verification results
  console.log("\nMap Data Verification Results:")
  console.log("=============================")
  console.log(`Total schools: ${totalSchools}`)
  console.log(
    `Schools with coordinates: ${schoolsWithCoordinates} (${(
      (schoolsWithCoordinates! / totalSchools) *
      100
    ).toFixed(1)}%)`
  )
  console.log(
    `Schools with static maps: ${schoolsWithStaticMaps} (${(
      (schoolsWithStaticMaps! / totalSchools) *
      100
    ).toFixed(1)}%)`
  )
  console.log(
    `Schools with geocode data: ${schoolsWithGeocodeData} (${(
      (schoolsWithGeocodeData! / totalSchools) *
      100
    ).toFixed(1)}%)`
  )

  console.log("\nAnalyzing Schools Missing Map Data:")
  console.log("================================")
  console.log(`Total schools missing map data: ${schoolsMissingData.length}`)

  // Analyze schools missing data
  const schoolsWithoutAddress = schoolsMissingData.filter(s => !s.address)
  const schoolsWithAddress = schoolsMissingData.filter(s => s.address)

  console.log(`\nBreakdown:`)
  console.log(`- Schools without address: ${schoolsWithoutAddress.length}`)
  console.log(`- Schools with address but no map data: ${schoolsWithAddress.length}`)

  if (schoolsWithoutAddress.length > 0) {
    console.log("\nSample of Schools Without Address:")
    console.log("===============================")
    schoolsWithoutAddress.slice(0, 5).forEach(school => {
      console.log(`\n${school.name}:`)
      console.log(`- State: ${school.state}`)
      console.log(`- City: ${school.city}`)
      console.log(`- Created at: ${new Date(school.created_at).toLocaleString()}`)
    })
  }

  if (schoolsWithAddress.length > 0) {
    console.log("\nSample of Schools With Address but No Map Data:")
    console.log("==========================================")
    schoolsWithAddress.slice(0, 5).forEach(school => {
      console.log(`\n${school.name}:`)
      console.log(`- Address: ${school.address}`)
      console.log(`- State: ${school.state}`)
      console.log(`- City: ${school.city}`)
      console.log(`- Created at: ${new Date(school.created_at).toLocaleString()}`)
    })
  }

  // Check for any geocoding errors in the logs
  const { data: failedGeocoding } = await supabase
    .from("schools")
    .select("name, address")
    .is("coordinates", null)
    .not("address", "is", null)
    .order("created_at", { ascending: false })
    .limit(10)

  if (failedGeocoding && failedGeocoding.length > 0) {
    console.log("\nTesting Geocoding for Sample Schools:")
    console.log("=================================")
    
    const client = new Client({})
    
    for (const school of failedGeocoding.slice(0, 3)) {
      console.log(`\nTesting geocoding for: ${school.name}`)
      console.log(`Address: ${school.address}`)
      
      try {
        const response = await client.geocode({
          params: {
            address: school.address,
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          },
        })
        
        if (response.data.status === "OK") {
          console.log("✓ Address can be geocoded successfully")
          console.log(`Result: ${response.data.results[0].formatted_address}`)
        } else {
          console.log(`✗ Geocoding failed with status: ${response.data.status}`)
        }
      } catch (error) {
        console.log("✗ Error testing geocoding:", error)
      }
    }
  }
}

// Run the verification
verifyMapData().catch((error) => {
  console.error("Error during verification:", error)
  process.exit(1)
}) 