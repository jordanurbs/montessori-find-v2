import type React from "react"
import "./globals.css"
import Link from "next/link"
import Image from "next/image"
import Head from "next/head"

export const metadata = {
  metadataBase: new URL('https://montessorifind.com'),
  title: {
    default: 'MontessoriFind - Find Montessori Schools Near You',
    template: '%s | MontessoriFind'
  },
  description: 'Search for Montessori schools in your area. Find details, reviews, and information about Montessori education options near you.',
  keywords: ['montessori', 'school', 'education', 'learning', 'directory', 'find', 'search', 'preschool', 'elementary'],
  authors: [{ name: 'MontessoriFind Team' }],
  creator: 'MontessoriFind',
  publisher: 'MontessoriFind',
  openGraph: {
    images: ['/assets/graphics/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/styles.css" />
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            margin-right: auto;
            margin-left: auto;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          @media (min-width: 640px) {
            .container {
              max-width: 640px;
            }
          }
          @media (min-width: 768px) {
            .container {
              max-width: 768px;
            }
          }
          @media (min-width: 1024px) {
            .container {
              max-width: 1024px;
            }
          }
          .flex {
            display: flex;
          }
          .flex-col {
            flex-direction: column;
          }
          .min-h-screen {
            min-height: 100vh;
          }
          .items-center {
            align-items: center;
          }
          .justify-between {
            justify-content: space-between;
          }
          .text-emerald-600 {
            color: rgb(5, 150, 105);
          }
          .border-b {
            border-bottom-width: 1px;
            border-bottom-style: solid;
            border-color: #e5e7eb;
          }
          .hidden {
            display: none;
          }
          @media (min-width: 768px) {
            .md\\:flex {
              display: flex;
            }
          }
          .bg-gray-900 {
            background-color: #111827;
          }
          .text-white {
            color: white;
          }
          .py-12 {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          .grid {
            display: grid;
          }
          @media (min-width: 768px) {
            .md\\:grid-cols-4 {
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }
          }
          .gap-8 {
            gap: 2rem;
          }
          .flex-1 {
            flex: 1 1 0%;
          }
        ` }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/montessorifindicon.svg" alt="MontessoriFind Logo" width={24} height={24} className="text-emerald-600" />
              <span className="text-xl font-bold text-emerald-600">MontessoriFind</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/browse" className="text-gray-700 hover:text-emerald-600">
                Browse by State
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-emerald-600">
                Blog
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-emerald-600">
                FAQ
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-emerald-600">
                About
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About & Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="hover:text-emerald-400">
                      About MontessoriFind
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-emerald-400">
                      Montessori Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-emerald-400">
                      Frequently Asked Questions
                    </Link>
                  </li>
  
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Popular Locations</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/states/ca" className="hover:text-emerald-400">
                      Montessori Schools in California
                    </Link>
                  </li>
                  <li>
                    <Link href="/states/ny" className="hover:text-emerald-400">
                      Montessori Schools in New York
                    </Link>
                  </li>
                  <li>
                    <Link href="/states/tx" className="hover:text-emerald-400">
                      Montessori Schools in Texas
                    </Link>
                  </li>
                  <li>
                    <Link href="/states/fl" className="hover:text-emerald-400">
                      Montessori Schools in Florida
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/states/ca/los-angeles" className="hover:text-emerald-400">
                      Montessori Schools in Los Angeles
                    </Link>
                  </li>
                  <li>
                    <Link href="/states/ny/new-york-city" className="hover:text-emerald-400">
                      Montessori Schools in New York City
                    </Link>
                  </li>
                  <li>
                    <Link href="/states/tx/houston" className="hover:text-emerald-400">
                      Montessori Schools in Houston
                    </Link>
                  </li>
                  <li>
                    <Link href="/states/fl/miami" className="hover:text-emerald-400">
                      Montessori Schools in Miami
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="hover:text-emerald-400">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-emerald-400">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="hover:text-emerald-400">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
              © {new Date().getFullYear()} MontessoriFind. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
