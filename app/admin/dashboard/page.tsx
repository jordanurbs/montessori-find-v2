"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { School, MapPin, Star } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStates: 0,
    totalCities: 0,
    totalReviews: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total schools
        const { count: schoolCount } = await supabase.from("schools").select("*", { count: "exact", head: true })

        // Get total states
        const { count: stateCount } = await supabase.from("states").select("*", { count: "exact", head: true })

        // Get total cities
        const { count: cityCount } = await supabase.from("cities").select("*", { count: "exact", head: true })

        // Get total reviews
        const { count: reviewCount } = await supabase.from("reviews").select("*", { count: "exact", head: true })

        setStats({
          totalSchools: schoolCount || 0,
          totalStates: stateCount || 0,
          totalCities: cityCount || 0,
          totalReviews: reviewCount || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Schools",
      value: stats.totalSchools,
      icon: School,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "States Covered",
      value: stats.totalStates,
      icon: MapPin,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Cities",
      value: stats.totalCities,
      icon: MapPin,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Reviews",
      value: stats.totalReviews,
      icon: Star,
      color: "bg-amber-100 text-amber-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the MontessoriFind admin dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No recent activity to display.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/dashboard/schools/new"
              className="block p-2 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            >
              Add New School
            </a>
            <a
              href="/admin/dashboard/content/new"
              className="block p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              Create Blog Post
            </a>
            <a
              href="/admin/dashboard/reviews"
              className="block p-2 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100"
            >
              Moderate Reviews
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
