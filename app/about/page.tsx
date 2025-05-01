import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'About MontessoriFind | Our Mission to Help Parents Find the Best Schools',
  description: 'Learn about MontessoriFind, our mission to help parents discover the perfect Montessori school for their children through comprehensive information and authentic reviews.'
}

export default function AboutPage() {
  return (
    <div className="mx-auto">
      {/* About MontessoriFind Hero Section */}
      <section className="relative w-full mb-32">
        {/* Hero Background */}
        <div className="relative w-full h-[300px]">
          <Image 
            src="/assets/graphics/backgrounds/pexels-tatianasyrikova-3933101.jpg" 
            alt="Montessori classroom materials" 
            fill 
            className="object-cover brightness-[0.85]"
            priority
          />
          {/* Semi-transparent white overlay */}
          <div className="absolute inset-0 bg-white bg-opacity-70"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-bold mb-6 text-center">About MontessoriFind</h1>
            <p className="text-lg text-center max-w-4xl mx-auto">
              Helping parents discover the perfect Montessori school for their children through
              comprehensive information and authentic reviews.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Our Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 mb-32">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg mb-4">
              MontessoriFind was created with a simple yet powerful mission: to make the
              search for quality Montessori education easier and more transparent for
              parents.
            </p>
            <p className="text-lg mb-4">
              We believe that finding the right educational environment is crucial for a child's
              development, and we're committed to providing the tools and information
              needed to make informed decisions.
            </p>
          </div>

          {/* Why MontessoriFind? */}
          <div className="bg-emerald-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Why MontessoriFind?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-emerald-600 mr-3 mt-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9H15V3H9V9H5L12 16L19 9Z" fill="currentColor" />
                    <path d="M5 18V20H19V18H5Z" fill="currentColor" />
                  </svg>
                </div>
                <p>Comprehensive database of verified Montessori schools across the country</p>
              </div>
              
              <div className="flex items-start">
                <div className="text-emerald-600 mr-3 mt-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                  </svg>
                </div>
                <p>Authentic reviews from parents and guardians</p>
              </div>
              
              <div className="flex items-start">
                <div className="text-emerald-600 mr-3 mt-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor" />
                  </svg>
                </div>
                <p>Easy-to-use search and filtering tools</p>
              </div>
              
              <div className="flex items-start">
                <div className="text-emerald-600 mr-3 mt-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" />
                  </svg>
                </div>
                <p>Community-driven insights and recommendations</p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold mb-4">Verified Information</h3>
              <p>
                Every school listing will be verified and regularly updated to ensure accuracy. We provide detailed information about programs, facilities, and teaching methods.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold mb-4">Real Reviews</h3>
              <p>
                Access authentic reviews (taken from Google Maps) from parents who have firsthand experience with the schools. Our review system helps you make informed decisions based on real experiences.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold mb-4">Easy Navigation</h3>
              <p>
                Find schools by location, browse through different states, or use our search feature to quickly find the perfect Montessori school for your child.
              </p>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-12">Roadmap: Features to Come</h2>
          
          <p className="text-lg mb-8 text-center">
            We're constantly working to improve MontessoriFind and add new features to better serve our community. Here's what's on our roadmap:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            <div className="flex">
              <div className="text-emerald-600 mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">School Photos</h3>
                <p>We're enhancing each school listing with images to provide a better visual understanding of the facilities and environment.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="text-emerald-600 mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2"><i>Association Montessori International</i> Recognition</h3>
                <p>We're adding AMI recognition status to each school listing, helping parents identify schools that meet the highest standards of Montessori education.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="text-emerald-600 mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM10 9H18V11H10V9ZM10 12H14V14H10V12ZM10 6H18V8H10V6Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Waldorf & Reggio Emilia School Listings</h3>
                <p>We're expanding our platform to include listings for Waldorf and Reggio Emilia schools, offering parents more educational options to explore.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="text-emerald-600 mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Interactive School Comparison</h3>
                <p>Soon you'll be able to select multiple schools and compare them side-by-side across various criteria, making it easier to find the perfect fit for your child.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="text-emerald-600 mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Parent Community</h3>
                <p>We're building a community platform where parents can connect, share experiences, ask questions, and support each other through the Montessori education journey.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About the Creator */}
        <section className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-12">About the Creator</h2>
          
          <div className="md:flex items-center gap-12">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <Image
                src="/assets/graphics/jordan-with-kids.jpg"
                alt="Jordan with his children in front of a volcano in El Salvador"
                width={400}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">A Personal Mission</h3>
              
              <p className="mb-4">
                When Jordan began researching educational options for his first-born, he found himself overwhelmed
                by the number of Montessori schools in his area.
              </p>
              
              <p className="mb-4">
                Each school tour left him with more questions than answers, and he struggled to compare them
                objectively. A brief thirty-minute visit hardly seemed sufficient to entrust someone with his child's
                education and wellbeing.
              </p>
              
              <p className="mb-4">
                Jordan knew there had to be a better way to evaluate these schools beyond superficial impressions
                and polished tour presentations.
              </p>
              
              <p className="mb-4">
                His mission became personal when his best friend's family was devastated by their preschool
                experience. Despite the school's stellar reputation, it took two police investigations and over a year to
                uncover a horrifying pattern of verbal and physical abuse by staff members.
              </p>
              
              <p className="mb-4">
                This tragedy highlighted the critical need for transparency and comprehensive reviews in childcare
                settings. Realizing that existing platforms like Google Maps weren't designed to adequately compare
                educational institutions side by side, Jordan decided to create MontessoriFind.com—a specialized
                platform where parents could share detailed experiences, compare schools using consistent criteria,
                and make truly informed decisions about their children's education.
              </p>
            </div>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-12">How You Can Get Involved</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-emerald-600 mb-4 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Submit Your Reviews</h3>
              <p>
                Share your experiences with Montessori schools to help other parents make informed decisions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-emerald-600 mb-4 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Report Any Issues</h3>
              <p>
                Help us maintain accurate and up-to-date information by reporting any discrepancies or issues.
              </p>
            </div>
          </div>
      
        </section>

        {/* Call to Action */}
        <section className="bg-emerald-50 rounded-lg p-12 text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Start Your Search Today</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Ready to find the perfect Montessori school for your child? Use our search tools to
            discover schools in your area and start your journey toward quality education.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/browse">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6">
                Search Montessori Schools
              </Button>
            </Link>
            
            <Link href="/states">
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6">
                Browse by State
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
} 