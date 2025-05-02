import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllStateAbbrs, getCitySlugsByStateAbbr, getSchoolsByCitySlug, getStates } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, ArrowLeft, Award } from "lucide-react"
import { slugify } from "@/lib/utils"
import { AMSPathwayModal } from "@/components/ams-pathway-modal"
import { supabase } from "@/lib/supabase"

// Generate all possible combinations of state_abbr and city_slug
export async function generateStaticParams() {
  // Get all state abbreviations
  const { data: states } = await supabase
    .from("distinct_states_view")
    .select("state_abbr")
    
  if (!states) return [];
  
  // For each state, get its cities and create the params
  const params = [];
  
  for (const state of states) {
    const cityParams = await getCitySlugsByStateAbbr(state.state_abbr);
    
    // Add state_abbr to each city param
    const stateParams = cityParams.map(city => ({
      state_abbr: state.state_abbr.toLowerCase(),
      ...city
    }));
    
    params.push(...stateParams);
  }
  
  return params;
}

export default async function CityPage(props: { params: { state_abbr: string, city_slug: string } }) {
  const { state_abbr, city_slug } = props.params
  
  // Convert state_abbr from URL (lowercase) to DB format (uppercase)
  const stateAbbr = state_abbr.toUpperCase()
  
  // Get states and find current state
  const states = await getStates()
  const state = states.find((s) => s.state_abbr === stateAbbr)

  if (!state) {
    notFound()
  }

  // Get schools for this city
  const schools = await getSchoolsByCitySlug(stateAbbr, city_slug)
  
  // Find actual city name (needed for display)
  const cityName = schools.length > 0 ? schools[0].city : city_slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())  // Basic slug-to-title conversion

  // If no schools found, check if city exists - if not, 404
  if (schools.length === 0) {
    const cities = await getCitySlugsByStateAbbr(stateAbbr)
    const cityExists = cities.some(c => c.city_slug === city_slug)
    
    if (!cityExists) {
      notFound()
    }
  }

  return (
    <div>
      {/* Green header section */}
      <div className="bg-emerald-800 text-white py-12 px-4 mb-10">
        <div className="max-w-4xl mx-auto">
          <Link 
            href={`/states/${state_abbr}`} 
            className="inline-flex items-center text-white/90 hover:text-white mb-6 text-lg font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Montessori Schools in {state.state}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Montessori Schools in {cityName}, {state.state}</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2">
            Discover {schools.length} Montessori {schools.length === 1 ? 'school' : 'schools'} in {cityName}
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          {schools.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No schools found in {cityName}, {state.state}. Please check back later.
            </p>
          ) : (
            schools.map((school) => (
              <Card
                key={school.id}
                className="bg-white border border-gray-200 rounded-xl transition-shadow duration-200 hover:shadow-lg p-0"
              >
                <CardContent className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/schools/${state_abbr}/${city_slug}/${school.slug}`}
                      className="text-2xl font-bold text-emerald-700 transition-colors duration-150 hover:text-emerald-800 focus:text-emerald-800 no-underline"
                      style={{ textDecoration: 'none' }}
                    >
                      {school.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-base mb-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <span>{school.address}</span>
                  </div>
                  <p className="text-gray-600 text-base mt-1">{
                    school.description
                      ? (school.description.split('. ')[0] + (school.description.includes('.') ? '.' : ''))
                      : "No description available."
                  }</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 