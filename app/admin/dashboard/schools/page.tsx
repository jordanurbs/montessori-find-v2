"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { School } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [states, setStates] = useState<{ code: string; name: string }[]>([])
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSchools() {
      try {
        let query = supabase.from("schools").select("*")

        if (stateFilter) {
          query = query.eq("state", stateFilter)
        }

        if (searchTerm) {
          query = query.ilike("name", `%${searchTerm}%`)
        }

        const { data, error } = await query.order("name")

        if (error) throw error
        setSchools(data || [])

        // Fetch states for filter
        const { data: statesData } = await supabase.from("states").select("code, name").order("name")

        setStates(statesData || [])
      } catch (error) {
        console.error("Error fetching schools:", error)
        toast({
          title: "Error",
          description: "Failed to load schools",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [searchTerm, stateFilter, toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this school?")) return

    try {
      const { error } = await supabase.from("schools").delete().eq("id", id)

      if (error) throw error

      setSchools(schools.filter((school) => school.id !== id))

      toast({
        title: "Success",
        description: "School deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting school:", error)
      toast({
        title: "Error",
        description: "Failed to delete school",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Schools</h1>
          <p className="text-gray-500 mt-1">Manage Montessori schools in the directory</p>
        </div>
        <Link href="/admin/dashboard/schools/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search schools..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.code} value={state.code}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Age Range</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No schools found
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{`${school.city}, ${school.state}`}</TableCell>
                    <TableCell>{school.age_range || "Not specified"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/dashboard/schools/${school.id}`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(school.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
