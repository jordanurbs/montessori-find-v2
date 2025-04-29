import { Suspense } from "react"
import Link from "next/link"
import { getStates } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapView } from "@/components/map-view"

export default async function BrowsePage() {
  const states = await getStates()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Montessori Schools</h1>

      <Tabs defaultValue="states">
        <TabsList className="mb-6">
          <TabsTrigger value="states">Browse by State</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="states">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {states.map((state) => (
              <Link key={state.state_abbr} href={`/states/${state.state_abbr.toLowerCase()}`} className="group">
                <Card className="hover:border-emerald-600 hover:shadow-sm transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="text-emerald-600 font-bold text-2xl mb-1">{state.state_abbr}</div>
                    <div className="font-medium">{state.state}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <div className="h-[600px] border rounded-lg overflow-hidden">
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              }
            >
              <MapView />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
