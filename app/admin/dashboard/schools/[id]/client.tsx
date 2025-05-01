"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { School } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save } from "lucide-react"

interface SchoolFormClientProps {
  id: string;
}

export default function SchoolFormClient({ id }: SchoolFormClientProps) {
  const isNew = id === "new"
  const schoolId = isNew ? null : Number.parseInt(id)
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [states, setStates] = useState<{ code: string; name: string }[]>([])
  const [cities, setCities] = useState<{ id: number; name: string; state: string }[]>([])

  const [formData, setFormData] = useState<Partial<School>>({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    website: "",
    email: "",
    age_range: "",
    features: [],
    hours_of_operation: {
      monday: "8:00 AM - 4:00 PM",
      tuesday: "8:00 AM - 4:00 PM",
      wednesday: "8:00 AM - 4:00 PM",
      thursday: "8:00 AM - 4:00 PM",
      friday: "8:00 AM - 4:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
  })

  useEffect(() => {
    async function fetchSchool() {
      if (isNew) return

      try {
        const { data, error } = await supabase.from("schools").select("*").eq("id", schoolId).single()

        if (error) throw error
        if (data) setFormData(data)
      } catch (error) {
        console.error("Error fetching school:", error)
        toast({
          title: "Error",
          description: "Failed to load school data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchStates() {
      try {
        const { data, error } = await supabase.from("states").select("code, name").order("name")

        if (error) throw error
        setStates(data || [])
      } catch (error) {
        console.error("Error fetching states:", error)
      }
    }

    fetchSchool()
    fetchStates()
  }, [isNew, schoolId, toast])

  useEffect(() => {
    async function fetchCities() {
      if (!formData.state) return

      try {
        const { data, error } = await supabase
          .from("cities")
          .select("id, name, state")
          .eq("state", formData.state)
          .order("name")

        if (error) throw error
        setCities(data || [])
      } catch (error) {
        console.error("Error fetching cities:", error)
      }
    }

    fetchCities()
  }, [formData.state])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleHoursChange = (day: string, value: string) => {
    setFormData((prev) => {
      const updatedHours = { ...(prev.hours_of_operation || {}) };
      updatedHours[day] = value;
      
      return {
        ...prev,
        hours_of_operation: updatedHours,
      };
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isNew) {
        const { data, error } = await supabase.from("schools").insert([formData]).select()

        if (error) throw error

        toast({
          title: "Success",
          description: "School added successfully",
        })

        router.push("/admin/dashboard/schools")
      } else {
        const { error } = await supabase.from("schools").update(formData).eq("id", schoolId)

        if (error) throw error

        toast({
          title: "Success",
          description: "School updated successfully",
        })

        router.push("/admin/dashboard/schools")
      }
    } catch (error: any) {
      console.error("Error saving school:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save school",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{isNew ? "Add New School" : "Edit School"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name *</Label>
                  <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age_range">Age Range</Label>
                  <Input
                    id="age_range"
                    name="age_range"
                    value={formData.age_range || ""}
                    onChange={handleChange}
                    placeholder="e.g., 18 months - 6th grade"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" value={formData.address || ""} onChange={handleChange} required />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state || ""}
                    onValueChange={(value) => handleSelectChange("state", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.city || ""}
                    onValueChange={(value) => handleSelectChange("city", value)}
                    disabled={!formData.state}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code *</Label>
                  <Input id="zip" name="zip" value={formData.zip || ""} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" value={formData.website || ""} onChange={handleChange} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Hours of Operation</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(formData.hours_of_operation || {}).map(([day, hours]) => (
                <div key={day} className="space-y-2">
                  <Label htmlFor={`hours-${day}`} className="capitalize">
                    {day}
                  </Label>
                  <Input id={`hours-${day}`} value={hours} onChange={(e) => handleHoursChange(day, e.target.value)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isNew ? "Create School" : "Update School"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 