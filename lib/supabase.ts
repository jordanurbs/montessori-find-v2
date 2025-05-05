import { createClient } from "@supabase/supabase-js"

// Make sure we have the required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.")
  console.error(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "Set" : "Missing"}`)
  console.error(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "Set" : "Missing"}`)
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")

// Add a function to test the connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("schools").select("id").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Successfully connected to Supabase" }
  } catch (err: any) {
    console.error("Supabase connection test exception:", err)
    return { success: false, error: err.message }
  }
}

export type School = {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  state_abbr: string
  google_maps_url: string
  phone: string
  email: string | null
  website: string
  monday_hours: string
  tuesday_hours: string
  wednesday_hours: string
  thursday_hours: string
  friday_hours: string
  saturday_hours: string
  sunday_hours: string
  rating: number
  total_ratings: string
  certified: string
  created_at: string
  updated_at: string
  slug: string
  ams_pathway_stage: string | null
  detail_page_url: string | null
  social_media_links: string | null
  zip?: string
  age_range?: string
  features?: any[]
  hours_of_operation?: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  geocode_data?: {
    formatted_address: string
    geometry: {
      location: {
        lat: number
        lng: number
      }
    }
    place_id: string
    types: string[]
  }
  static_map_url?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export type Review = {
  id: string
  school_id: string
  author: string
  rating: number
  text: string
  created_at: string
}

export type State = {
  state: string
  state_abbr: string
}

export async function getStates(): Promise<State[]> {
  const { data, error } = await supabase.from("distinct_states_view").select("*").order("state")

  if (error) {
    console.error("Error fetching states:", error)
    return []
  }

  return data || []
}

export async function getSchoolsByState(state_abbr: string): Promise<School[]> {
  const { data, error } = await supabase.from("schools").select("*").eq("state_abbr", state_abbr).order("name")

  if (error) {
    console.error("Error fetching schools:", error)
    return []
  }

  return data || []
}

export async function getSchoolsByCity(city: string, state_abbr: string): Promise<School[]> {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("city", city)
    .eq("state_abbr", state_abbr)
    .order("name")

  if (error) {
    console.error("Error fetching schools:", error)
    return []
  }

  return data || []
}

export async function getSchoolById(id: string): Promise<School | null> {
  const { data, error } = await supabase.from("schools").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching school:", error)
    return null
  }

  return data
}

export async function getReviewsBySchoolId(schoolId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data || []
}

export async function getSchoolsCount(): Promise<number> {
  const { count, error } = await supabase.from("schools").select("*", { count: "exact", head: true })

  if (error) {
    console.error("Error counting schools:", error)
    return 0
  }

  return count || 0
}

export async function getSchoolsCountByState(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("schools").select("state_abbr")

  if (error) {
    console.error("Error fetching schools count by state:", error)
    return {}
  }

  const counts: Record<string, number> = {}
  data.forEach((school) => {
    const stateAbbr = school.state_abbr
    counts[stateAbbr] = (counts[stateAbbr] || 0) + 1
  })

  return counts
}

export async function getCitiesByState(state_abbr: string): Promise<string[]> {
  const { data, error } = await supabase.from("schools").select("city").eq("state_abbr", state_abbr).order("city")

  if (error) {
    console.error("Error fetching cities:", error)
    return []
  }

  // Extract unique cities
  const cities = [...new Set(data.map((item) => item.city))]
  return cities
}

/**
 * New functions for slug-based routes
 */

// Used for generateStaticParams in app/states/[state_abbr]
export async function getAllStateAbbrs(): Promise<{ state_abbr: string }[]> {
  const { data, error } = await supabase
    .from("distinct_states_view")
    .select("state_abbr")
    .order("state_abbr")

  if (error) {
    console.error("Error fetching state abbreviations:", error)
    return []
  }

  return data || []
}

// Used for generateStaticParams in app/states/[state_abbr]/[city_slug]
export async function getCitySlugsByStateAbbr(state_abbr: string): Promise<{ city_slug: string }[]> {
  const { data, error } = await supabase
    .from("schools")
    .select("city")
    .eq("state_abbr", state_abbr)
    .order("city")

  if (error) {
    console.error("Error fetching cities by state:", error)
    return []
  }

  // Extract unique cities, convert to slugs, and format for generateStaticParams
  const cities = [...new Set(data.map((item) => item.city))]
  
  // Import not available here, so duplicating the essential part of the slugify function
  const slugify = (text: string): string => {
    if (!text) return ""
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  }
  
  return cities.map(city => ({ city_slug: slugify(city) }))
}

// Used for generateStaticParams in app/schools/[state_abbr]/[city_slug]/[school_slug]
export async function getSchoolSlugParams(): Promise<{ state_abbr: string, city_slug: string, school_slug: string }[]> {
  // This will fetch ALL schools - may be inefficient for very large databases
  // Consider separating this by state or adding pagination for extremely large datasets
  const { data, error } = await supabase
    .from("schools")
    .select("state_abbr, city, slug")

  if (error) {
    console.error("Error fetching school slug parameters:", error)
    return []
  }

  // Generate city_slug from city name for each school
  const slugify = (text: string): string => {
    if (!text) return ""
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  }

  return (data || []).map(school => ({
    state_abbr: school.state_abbr.toLowerCase(),
    city_slug: slugify(school.city),
    school_slug: school.slug
  }))
}

// Get a specific school by its slug parameters
export async function getSchoolBySlugs(state_abbr: string, city_slug: string, school_slug: string): Promise<School | null> {
  // The slugify function is used in multiple places, so define it once
  const slugify = (text: string): string => {
    if (!text) return ""
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  }

  // Find all schools that match state and slug
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("state_abbr", state_abbr.toUpperCase()) // Store as uppercase in DB but URLs use lowercase
    .eq("slug", school_slug)

  if (error) {
    console.error("Error fetching schools by slugs:", error)
    return null
  }

  if (!data || data.length === 0) {
    console.log(`No schools found with slug '${school_slug}' in state '${state_abbr}'`)
    return null
  }

  // Filter to find the school with the matching city_slug
  const matchingSchool = data.find(school => slugify(school.city) === city_slug)
  
  if (!matchingSchool) {
    console.error(`Found ${data.length} schools with slug '${school_slug}' in state '${state_abbr}', but none in city with slug '${city_slug}'`)
    return null
  }

  return matchingSchool
}

// Get reviews for a school using slug parameters
export async function getReviewsBySchoolSlugs(state_abbr: string, city_slug: string, school_slug: string): Promise<Review[]> {
  // First get the school_id from the slugs
  const school = await getSchoolBySlugs(state_abbr, city_slug, school_slug)
  
  if (!school) {
    return []
  }
  
  // Then use the existing function to get reviews
  return getReviewsBySchoolId(school.id)
}

// Get schools for a state landing page
export async function getSchoolsByStateAbbr(state_abbr: string): Promise<School[]> {
  // This is essentially the same as getSchoolsByState but named to fit the new pattern
  return getSchoolsByState(state_abbr)
}

// Get schools for a city landing page
export async function getSchoolsByCitySlug(state_abbr: string, city_slug: string): Promise<School[]> {
  // Get all schools for this state
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("state_abbr", state_abbr.toUpperCase())
    .order("name")

  if (error) {
    console.error("Error fetching schools for city slug:", error)
    return []
  }

  // Filter to find those matching the city_slug
  const slugify = (text: string): string => {
    if (!text) return ""
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  }
  
  return (data || []).filter(school => slugify(school.city) === city_slug)
}
