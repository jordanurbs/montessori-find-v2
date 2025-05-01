import type React from "react"
import "./globals.css"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "MontessoriFind - Find the Best Montessori Schools",
  description: "Your trusted resource for finding the best Montessori schools.",
    generator: 'v0.dev',
    openGraph: {
      images: ['/assets/graphics/og-image.jpg'],
    }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
                  <li>
                    <Link href="/contact" className="hover:text-emerald-400">
                      Contact Us
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
