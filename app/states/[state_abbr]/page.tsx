import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllStateAbbrs, getSchoolsByStateAbbr, getStates } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, ArrowLeft, Award } from "lucide-react"
import { slugify } from "@/lib/utils"
import { AMSPathwayModal } from "@/components/ams-pathway-modal"

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

  const schools = await getSchoolsByStateAbbr(stateAbbr)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to States
      </Link>

      <h1 className="text-3xl font-bold mb-2">Montessori Schools in {state.state}</h1>
      <p className="text-gray-600 mb-8">
        Showing {schools.length} Montessori {schools.length === 1 ? 'school' : 'schools'} in {state.state}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.length === 0 ? (
          <p className="col-span-full text-center py-12 text-gray-500">
            No schools found in {state.state}. Please check back later.
          </p>
        ) : (
          schools.map((school) => (
            <div key={school.id} className="group">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Link href={`/schools/${state_abbr}/${slugify(school.city)}/${school.slug}`}>
                      <h2 className="text-xl font-bold text-emerald-700 group-hover:text-emerald-800">{school.name}</h2>
                    </Link>
                    
                    {/* Display AMS Pathway badge if available */}
                    {school.ams_pathway_stage && (
                      <div className="relative">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {school.ams_pathway_stage}
                        </span>
                        <div className="absolute top-0 right-0 transform translate-x-full ml-2">
                          <AMSPathwayModal currentStage={school.ams_pathway_stage} />
                        </div>
                      </div>
                    )}
                  </div>

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

                  <Link 
                    href={`/schools/${state_abbr}/${slugify(school.city)}/${school.slug}`}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    View School Details →
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
