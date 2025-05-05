import { createClient } from '@supabase/supabase-js'

async function addMapColumns() {
  console.log("Starting script to add map-related columns to schools table...")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL environment variable is not set.")
    process.exit(1)
  }
  if (!supabaseServiceRoleKey) {
    console.error(
      "Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set. This is required to update the database schema."
    )
    console.error("Please add it to your .env file. It can be found in your Supabase project settings under API.")
    process.exit(1)
  }

  // Initialize Supabase client with Service Role Key
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  try {
    // Add geocode_data column (JSONB)
    console.log("Adding geocode_data column...")
    const { error: geocodeError } = await supabaseAdmin.rpc('add_geocode_data_column')
    if (geocodeError) {
      console.error("Error adding geocode_data column:", geocodeError.message)
      process.exit(1)
    }

    // Add static_map_url column (TEXT)
    console.log("Adding static_map_url column...")
    const { error: mapUrlError } = await supabaseAdmin.rpc('add_static_map_url_column')
    if (mapUrlError) {
      console.error("Error adding static_map_url column:", mapUrlError.message)
      process.exit(1)
    }

    // Add coordinates column (JSONB)
    console.log("Adding coordinates column...")
    const { error: coordinatesError } = await supabaseAdmin.rpc('add_coordinates_column')
    if (coordinatesError) {
      console.error("Error adding coordinates column:", coordinatesError.message)
      process.exit(1)
    }

    console.log("Successfully added all map-related columns to the schools table!")
  } catch (error: any) {
    console.error("Unexpected error:", error.message)
    process.exit(1)
  }
}

addMapColumns() 