import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllStateAbbrs, getStates, getCitySlugsByStateAbbr, getSchoolsByStateAbbr } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ArrowLeft } from "lucide-react"

export async function generateStaticParams() {
  const stateAbbrs = await getAllStateAbbrs()
  return stateAbbrs.map((item) => ({
    state_abbr: item.state_abbr.toLowerCase(),
  }))
}

export default async function StatePage(props: { params: { state_abbr: string } }) {
  const { state_abbr } = props.params
  const stateAbbr = state_abbr.toUpperCase()
  const states = await getStates()
  const state = states.find((s) => s.state_abbr === stateAbbr)

  if (!state) {
    notFound()
  }

  // Fetch unique cities for this state
  const citySlugs = await getCitySlugsByStateAbbr(stateAbbr)
  // Fetch all schools for this state
  const schools = await getSchoolsByStateAbbr(stateAbbr)
  // Group schools by city and count
  const citySchoolCounts: Record<string, number> = {}
  for (const school of schools) {
    if (!school.city) continue
    citySchoolCounts[school.city] = (citySchoolCounts[school.city] || 0) + 1
  }
  // Helper to get city name from slug
  const slugToCityName = (slug: string) =>
    slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  // Helper to get count by slug
  const getCountBySlug = (slug: string) => {
    // Find the city name in the schools list that matches this slug
    const match = Object.keys(citySchoolCounts).find(city =>
      city &&
      city.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '') === slug
    )
    return match ? citySchoolCounts[match] : 0
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to States
      </Link>

      <h1 className="text-3xl font-bold mb-2">Montessori Cities in {state.state}</h1>
      <p className="text-gray-600 mb-8">
        Showing {citySlugs.length} {citySlugs.length === 1 ? 'city' : 'cities'} in {state.state}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {citySlugs.length === 0 ? (
          <p className="col-span-full text-center py-12 text-gray-500">
            No cities found in {state.state}. Please check back later.
          </p>
        ) : (
          citySlugs.map(({ city_slug }) => {
            const cityName = slugToCityName(city_slug)
            const count = getCountBySlug(city_slug)
            return (
              <Link
                key={city_slug}
                href={`/states/${state_abbr}/${city_slug}`}
                className="block group"
                style={{ textDecoration: 'none' }}
              >
                <Card
                  className="h-32 flex items-center justify-center border border-gray-200 rounded-xl transition-shadow duration-200 cursor-pointer group-hover:shadow-lg"
                >
                  <CardContent className="flex flex-col items-center justify-center w-full h-full p-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-6 w-6 text-emerald-600" />
                      <span className="text-xl font-bold text-gray-900">{cityName}</span>
                    </div>
                    <span className="text-gray-500 text-base font-medium mt-1">{count} {count === 1 ? 'school' : 'schools'}</span>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
