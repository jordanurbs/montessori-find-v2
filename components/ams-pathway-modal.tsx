"use client"

import React from "react"
import Image from "next/image"
import { Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AMSPathwayModalProps {
  currentStage?: string | null
}

export function AMSPathwayModal({ currentStage }: AMSPathwayModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
          <Info className="h-3 w-3 mr-1" />
          What is this?
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">The AMS Four-Stage Pathway</DialogTitle>
          <DialogDescription className="text-center">
            The American Montessori Society (AMS) pathway outlines the progression of schools through recognition stages
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-sky-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-center mb-4">Understanding AMS Pathway Stages</h3>
            <p className="mb-4">
              The American Montessori Society (AMS) has established a pathway for schools to demonstrate their commitment to authentic Montessori education. 
              This four-stage pathway represents increasing levels of alignment with AMS standards and practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-lg p-4 border ${currentStage?.toLowerCase().includes('member') ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
              <h4 className="font-bold text-lg mb-2">Stage 1: Member School</h4>
              <p className="text-gray-700 mb-3">
                Member schools join AMS for personalized support, exclusive resources, and connecting with other school communities.
              </p>
              <div className="flex justify-center">
                <div className="w-24 h-24 relative">
                  <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center">
                    <div className="text-purple-800 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 10v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8M7 8.5V5a2 2 0 0 1 4 0v3.5M13 8.5V5a2 2 0 0 1 4 0v3.5M5 8.5h14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 border ${currentStage?.toLowerCase().includes('verified') ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
              <h4 className="font-bold text-lg mb-2">Stage 2: Verified School</h4>
              <p className="text-gray-700 mb-3">
                A member school becomes verified once AMS confirms they uphold the 5 core components of Montessori Education.
              </p>
              <div className="flex justify-center">
                <div className="w-24 h-24 relative">
                  <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center">
                    <div className="text-blue-800 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L2 8c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-.012 0-.025-.001-.037l-.381-.987z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 border ${currentStage?.toLowerCase().includes('candidate') ? 'border-teal-300 bg-teal-50' : 'border-gray-200'}`}>
              <h4 className="font-bold text-lg mb-2">Stage 3: Accreditation Candidate</h4>
              <p className="text-gray-700 mb-3">
                To be a candidate for accreditation a school must be verified, meet the prerequisites, and have an approved application.
              </p>
              <div className="flex justify-center">
                <div className="w-24 h-24 relative">
                  <div className="w-24 h-24 bg-teal-200 rounded-full flex items-center justify-center">
                    <div className="text-teal-800 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 border ${currentStage?.toLowerCase().includes('accredited') ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
              <h4 className="font-bold text-lg mb-2">Stage 4: Accredited School</h4>
              <p className="text-gray-700 mb-3">
                A school earns AMS accreditation after writing a self-study and hosting a visiting team that verifies compliance with our accreditation standards.
              </p>
              <div className="flex justify-center">
                <div className="w-24 h-24 relative">
                  <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center">
                    <div className="text-green-800 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="italic text-amber-900">
              Note: The AMS pathway reflects a school's commitment to maintaining high standards of Montessori education. 
              For more detailed information, visit the <a href="https://amshq.org/Educators/Montessori-Schools/AMS-Membership/Types-of-Memberships" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-900 underline">American Montessori Society website</a>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 