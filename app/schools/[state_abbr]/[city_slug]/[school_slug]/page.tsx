import { notFound } from "next/navigation"
import Link from "next/link"
import { getSchoolBySlugs, getReviewsBySchoolSlugs, getSchoolSlugParams } from "@/lib/supabase"
import { GoogleMap } from "@/components/google-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Phone, Globe, Mail, ArrowLeft, Award } from "lucide-react"

// Generate all slug parameters for static page generation
export async function generateStaticParams() {
  return getSchoolSlugParams()
}

export default async function SchoolPage(props: { 
  params: { state_abbr: string, city_slug: string, school_slug: string } 
}) {
  const { state_abbr, city_slug, school_slug } = props.params
  
  // Get school data by slug parameters
  const school = await getSchoolBySlugs(state_abbr, city_slug, school_slug)
  
  // Get reviews for the school by slug parameters
  const reviews = await getReviewsBySchoolSlugs(state_abbr, city_slug, school_slug)

  if (!school) {
    notFound()
  }

  const fullAddress = `${school.address}`

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/states/${state_abbr}/${city_slug}`}
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {school.city} Schools
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{school.name}</h1>
              {school.certified === "true" && (
                <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Certified
                </div>
              )}
            </div>
            <div className="flex items-center mt-2 text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{fullAddress}</span>
            </div>
            {school.rating > 0 && (
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(school.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">
                  {school.rating.toFixed(1)} ({school.total_ratings}{" "}
                  {Number.parseInt(school.total_ratings) === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>

          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-line">{school.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoogleMap address={fullAddress} markerTitle={school.name} height="300px" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-6">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-500">No reviews yet. Be the first to review this school!</p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">{review.author}</div>
                        <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </CardContent>
                  </Card>
                ))
              )}
              <div className="text-center">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Write a Review</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {school.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <a href={`tel:${school.phone}`} className="text-emerald-600 hover:underline">
                      {school.phone}
                    </a>
                  </div>
                </div>
              )}

              {school.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <a href={`mailto:${school.email}`} className="text-emerald-600 hover:underline">
                      {school.email}
                    </a>
                  </div>
                </div>
              )}

              {school.website && (
                <div className="flex items-start">
                  <Globe className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Website</div>
                    <a
                      href={school.website.startsWith("http") ? school.website : `https://${school.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}

              {school.google_maps_url && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Directions</div>
                    <a
                      href={school.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hours of Operation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="font-medium">Monday</div>
                  <div>{school.monday_hours}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Tuesday</div>
                  <div>{school.tuesday_hours}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Wednesday</div>
                  <div>{school.wednesday_hours}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Thursday</div>
                  <div>{school.thursday_hours}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Friday</div>
                  <div>{school.friday_hours}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Saturday</div>
                  <div>{school.saturday_hours}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Sunday</div>
                  <div>{school.sunday_hours}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 