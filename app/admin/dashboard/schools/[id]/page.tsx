import { Suspense } from "react"
import SchoolFormClient from "./client"

export default function SchoolFormPage({ params }: { params: { id: string } }) {
  // Server component that just passes the params to the client component
  return (
    <Suspense fallback={
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SchoolFormClient id={params.id} />
    </Suspense>
  )
}
