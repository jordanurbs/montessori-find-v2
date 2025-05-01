import Link from "next/link"
import { getStates, getSchoolsCount } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default async function HomePage() {
  let states: any[] = []
  let totalSchools = 0

  try {
    states = await getStates()
    totalSchools = await getSchoolsCount()
  } catch (error) {
    console.error("Error fetching data:", error)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-emerald-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to MontessoriFind</h1>
          <p className="text-xl md:text-2xl mb-8">Your trusted resource for finding the best Montessori schools.</p>
          <p className="text-lg mb-8">Currently featuring {totalSchools} school listings in our database</p>
          <Link href="/browse">
            <Button className="bg-white text-emerald-700 hover:bg-gray-100 text-lg px-8 py-6">
              Find a Montessori School
            </Button>
          </Link>
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by State</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {states.map((state) => (
              <Link key={state.state_abbr} href={`/states/${state.state_abbr.toLowerCase()}`} className="group">
                <div className="border rounded-lg p-4 text-center hover:border-emerald-600 hover:shadow-sm transition-all">
                  <div className="text-emerald-600 font-bold text-2xl mb-1">{state.state_abbr}</div>
                  <div className="font-medium">{state.state}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Why Choose Montessori */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Montessori Education?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3">Child-Centered Learning</h3>
                <p>
                  Children learn at their own pace and follow their natural interests, developing a love for learning.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Respects each child's unique developmental timeline</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Builds intrinsic motivation through meaningful work</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3">Independence & Confidence</h3>
                <p>Students develop self-discipline and confidence through hands-on learning experiences.</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Develops executive function and self-regulation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Builds practical life skills for real-world success</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3">Social Development</h3>
                <p>Mixed-age classrooms foster leadership, collaboration, and respect for others.</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Builds community through grace and courtesy lessons</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Creates natural mentorship opportunities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/about">
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Learn More About Montessori
              </Button>
            </Link>
          </div>
        </div>
      </section>

  
    
    </div>
  )
}
