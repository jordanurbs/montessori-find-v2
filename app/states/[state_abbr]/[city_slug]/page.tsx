import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllStateAbbrs, getCitySlugsByStateAbbr, getSchoolsByCitySlug, getStates } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, ArrowLeft } from "lucide-react"
import { slugify } from "@/lib/utils"

// Generate all possible combinations of state_abbr and city_slug
export async function generateStaticParams({ params }: { params: { state_abbr: string } }) {
  if (!params || !params.state_abbr) {
    console.error("Missing state_abbr in params for [city_slug] generateStaticParams");
    return [];
  }
  
  // Get all city slugs for this state
  const cityParams = await getCitySlugsByStateAbbr(params.state_abbr.toUpperCase())
  
  return cityParams
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
    <div className="container mx-auto px-4 py-8">
      <Link 
        href={`/states/${state_abbr}`} 
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {state.state}
      </Link>

      <h1 className="text-3xl font-bold mb-2">Montessori Schools in {cityName}, {state.state}</h1>
      <p className="text-gray-600 mb-8">
        Showing {schools.length} Montessori {schools.length === 1 ? 'school' : 'schools'} in {cityName}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.length === 0 ? (
          <p className="col-span-full text-center py-12 text-gray-500">
            No schools found in {cityName}, {state.state}. Please check back later.
          </p>
        ) : (
          schools.map((school) => (
            <Link 
              key={school.id} 
              href={`/schools/${state_abbr}/${city_slug}/${school.slug}`}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-emerald-700">{school.name}</h2>

                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {school.city}, {state.state_abbr}
                    </span>
                  </div>

                  {school.rating > 0 && (
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(school.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {school.rating.toFixed(1)} ({school.total_ratings})
                      </span>
                    </div>
                  )}

                  <p className="text-gray-600 line-clamp-3 mb-3">{school.description || "No description available."}</p>

                  <div className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    View School Details →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
} 