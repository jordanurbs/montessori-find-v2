import { notFound } from "next/navigation"
import Link from "next/link"
import { getSchoolBySlugs, getReviewsBySchoolSlugs, getSchoolSlugParams } from "@/lib/supabase"
import { SecureGoogleMap } from "@/components/secure-google-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Phone, Globe, Mail, ArrowLeft, Award, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react"
import { AMSPathwayModal } from "@/components/ams-pathway-modal"

// Generate all slug parameters for static page generation
export async function generateStaticParams() {
  return getSchoolSlugParams()
}

// Helper function to parse social media links JSON
function parseSocialMediaLinks(socialMediaLinksJson: string | null) {
  if (!socialMediaLinksJson) return [];
  
  try {
    // Check if the string starts with http, meaning it's a direct URL and not JSON
    if (typeof socialMediaLinksJson === 'string' && socialMediaLinksJson.trim().startsWith('http')) {
      // It's a URL, not JSON - create a simple object with the URL
      const url = socialMediaLinksJson.trim();
      // Try to detect the platform from the URL
      let platform = 'website';
      if (url.includes('facebook.com')) platform = 'Facebook';
      else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'Twitter';
      else if (url.includes('instagram.com')) platform = 'Instagram';
      else if (url.includes('youtube.com')) platform = 'YouTube';
      else if (url.includes('linkedin.com')) platform = 'LinkedIn';
      
      return [{ platform, url }];
    }
    
    // Try to validate if it looks like a JSON string before parsing
    if (typeof socialMediaLinksJson === 'string' && 
        (socialMediaLinksJson.trim().startsWith('{') || socialMediaLinksJson.trim().startsWith('['))) {
      // Looks like valid JSON, attempt to parse
      const socialLinks = JSON.parse(socialMediaLinksJson);
      
      // Return an array of parsed links if valid
      if (Array.isArray(socialLinks)) {
        return socialLinks.filter(link => link && link.url);
      } else if (typeof socialLinks === 'object') {
        // If it's an object, convert to array of {platform, url} objects
        return Object.entries(socialLinks).map(([platform, url]) => ({ platform, url }));
      }
    } else if (typeof socialMediaLinksJson === 'string') {
      // Not JSON, treat as a URL if it seems like one
      const url = socialMediaLinksJson.trim();
      if (url.includes('http')) {
        // Determine platform from URL if possible
        let platform = 'website';
        if (url.includes('facebook.com')) platform = 'Facebook';
        else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'Twitter';
        else if (url.includes('instagram.com')) platform = 'Instagram';
        else if (url.includes('youtube.com')) platform = 'YouTube';
        else if (url.includes('linkedin.com')) platform = 'LinkedIn';
        
        return [{ platform, url }];
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error parsing social media links:", error);
    // If JSON parsing fails, try to handle it as a plain string
    if (typeof socialMediaLinksJson === 'string') {
      const url = socialMediaLinksJson.trim();
      if (url.includes('http')) {
        // Determine platform from URL if possible
        let platform = 'website';
        if (url.includes('facebook.com')) platform = 'Facebook';
        else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'Twitter';
        else if (url.includes('instagram.com')) platform = 'Instagram';
        else if (url.includes('youtube.com')) platform = 'YouTube';
        else if (url.includes('linkedin.com')) platform = 'LinkedIn';
        
        return [{ platform, url }];
      }
    }
    return [];
  }
}

// Helper function to get the icon for a social media platform
function getSocialMediaIcon(platform: string) {
  const lowerPlatform = platform.toLowerCase();
  
  if (lowerPlatform.includes('facebook')) return Facebook;
  if (lowerPlatform.includes('twitter') || lowerPlatform.includes('x.com')) return Twitter;
  if (lowerPlatform.includes('instagram')) return Instagram;
  if (lowerPlatform.includes('youtube')) return Youtube;
  if (lowerPlatform.includes('linkedin')) return Linkedin;
  
  // Default to Globe icon if platform is not recognized
  return Globe;
}

export default async function SchoolPage(props: { 
  params: { state_abbr: string, city_slug: string, school_slug: string } 
}) {
  // Fix to ensure we properly await the params
  const params = await Promise.resolve(props.params);
  const { state_abbr, city_slug, school_slug } = params;
  
  // Get school data by slug parameters
  const school = await getSchoolBySlugs(state_abbr, city_slug, school_slug)
  
  // Get reviews for the school by slug parameters
  const reviews = await getReviewsBySchoolSlugs(state_abbr, city_slug, school_slug)

  if (!school) {
    notFound()
  }

  const fullAddress = `${school.address}`
  
  // Parse social media links if available
  const socialMediaLinks = parseSocialMediaLinks(school.social_media_links);

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
            
            {/* Display AMS Pathway Stage if available with Modal */}
            {school && false && school.ams_pathway_stage && (
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                  {school.detail_page_url ? (
                    <a href={school.detail_page_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {school.ams_pathway_stage}
                    </a>
                  ) : (
                    school.ams_pathway_stage
                  )}
                </span>
                <AMSPathwayModal currentStage={school.ams_pathway_stage ?? undefined} />
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
                  {school ? (
                    <SecureGoogleMap school={school} height="300px" />
                  ) : (
                    <div className="h-[300px] flex items-center justify-center bg-gray-100 text-gray-500">
                      No location information available
                    </div>
                  )}
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
              
              {/* Social Media Links */}
              {socialMediaLinks.length > 0 && (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="font-medium mb-2">Social Media</div>
                    <div className="flex flex-wrap gap-3">
                      {socialMediaLinks.map((link, index) => {
                        if (!link.url || !link.platform) return null;
                        
                        const IconComponent = getSocialMediaIcon(link.platform);
                        return (
                          <a 
                            key={index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-emerald-600 transition-colors"
                            title={link.platform}
                          >
                            <IconComponent className="h-6 w-6" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Additional Pathway Information with Modal link */}
          {school && false && school.ams_pathway_stage && school.detail_page_url && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Additional Information</CardTitle>
                <AMSPathwayModal currentStage={school.ams_pathway_stage ?? undefined} />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Award className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" />
                    <div>
                      <div className="font-medium">AMS Pathway Stage</div>
                      <div className="text-sm">{school.ams_pathway_stage}</div>
                      <a
                        href={school.detail_page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline text-sm"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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