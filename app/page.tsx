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

      {/* Latest Blog Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Latest from Our Blog</h2>
            <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 flex items-center">
              View all articles →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample blog posts - in a real app, these would be fetched from the database */}
            <Card>
              <img
                src="/sunlit-montessori-learning.png"
                alt="Montessori classroom"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-2">March 10, 2025</div>
                <h3 className="text-xl font-bold mb-2">7 Key Signs of an Authentic Montessori Classroom</h3>
                <p className="text-gray-600 mb-4">
                  Learn the essential features of an authentic Montessori classroom, from multi-age groups to certified
                  teachers.
                </p>
                <Link href="/blog/authentic-montessori-classroom" className="text-emerald-600 hover:text-emerald-700">
                  Read more →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <img
                src="/placeholder.svg?key=thc5n"
                alt="Montessori vs traditional education"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-2">April 8, 2025</div>
                <h3 className="text-xl font-bold mb-2">Montessori vs Traditional Education: Key Differences</h3>
                <p className="text-gray-600 mb-4">
                  Explore the key differences between Montessori and traditional education, including learning styles
                  and classroom environment.
                </p>
                <Link href="/blog/montessori-vs-traditional" className="text-emerald-600 hover:text-emerald-700">
                  Read more →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <img
                src="/placeholder.svg?key=ho2fr"
                alt="Private vs public Montessori schools"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-2">March 10, 2025</div>
                <h3 className="text-xl font-bold mb-2">Private vs Public Montessori Schools: Making the Choice</h3>
                <p className="text-gray-600 mb-4">
                  Explore the key differences between private and public Montessori schools, including costs,
                  curriculum, and accessibility.
                </p>
                <Link href="/blog/private-vs-public-montessori" className="text-emerald-600 hover:text-emerald-700">
                  Read more →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Montessori Education Insights</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest Montessori education news, tips, and school updates.
          </p>

          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
            <Button className="bg-emerald-600 hover:bg-emerald-700">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  )
}
