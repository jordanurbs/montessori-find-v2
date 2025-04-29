import { notFound } from "next/navigation"
import Link from "next/link"
import { getSchoolsByState, getStates } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, ArrowLeft } from "lucide-react"

export async function generateStaticParams() {
  const states = await getStates()
  return states.map((state) => ({
    state_abbr: state.state_abbr.toUpperCase(),
  }))
}

export default async function StatePage({ params: { state_abbr } }: { params: { state_abbr: string } }) {
  const stateAbbr = state_abbr
  const states = await getStates()
  const state = states.find((s) => s.state_abbr === stateAbbr)

  if (!state) {
    notFound()
  }

  const schools = await getSchoolsByState(stateAbbr)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/browse" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Browse
      </Link>

      <h1 className="text-3xl font-bold mb-2">Montessori Schools in {state.state}</h1>
      <p className="text-gray-600 mb-8">
        Showing {schools.length} Montessori schools in {state.state}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.length === 0 ? (
          <p className="col-span-full text-center py-12 text-gray-500">
            No schools found in {state.state}. Please check back later.
          </p>
        ) : (
          schools.map((school) => (
            <Link key={school.id} href={`/schools/${school.id}`}>
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
