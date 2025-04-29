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
