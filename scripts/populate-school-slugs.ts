#!/usr/bin/env node
// Usage: pnpm exec ts-node scripts/populate-school-slugs.ts

import { createClient } from "@supabase/supabase-js"
import { slugify } from "../lib/utils" // Adjust path if needed
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

async function populateSlugs() {
  console.log("Starting slug population script...")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use Service Role Key for updates

  if (!supabaseUrl) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL environment variable is not set.")
    process.exit(1)
  }
  if (!supabaseServiceRoleKey) {
    console.error(
      "Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set. This is required to update data."
    )
    console.error("Please add it to your .env file. It can be found in your Supabase project settings under API.")
    process.exit(1)
  }

  // Initialize Supabase client with Service Role Key
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      // Required for service role key
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  console.log("Fetching all schools from Supabase using pagination...")
  const allSchools = []
  const fetchBatchSize = 1000 // Supabase default limit, adjust if needed
  let currentOffset = 0

  while (true) {
    console.log(`Fetching batch starting from offset ${currentOffset}...`)
    const { data: batch, error: fetchError } = await supabaseAdmin
      .from("schools")
      .select("id, name, slug") // Select existing slug to avoid re-processing if run again
      .range(currentOffset, currentOffset + fetchBatchSize - 1)
      // .is('slug', null) // Uncomment to only fetch schools where slug IS NULL

    if (fetchError) {
      console.error(`Error fetching batch at offset ${currentOffset}:`, fetchError.message)
      process.exit(1)
    }

    if (!batch || batch.length === 0) {
      console.log("No more schools found in this batch. Fetching complete.")
      break // Exit loop if no more schools
    }

    console.log(`Fetched ${batch.length} schools in this batch.`)
    allSchools.push(...batch)

    // If the number of returned schools is less than the batch size, we've reached the end
    if (batch.length < fetchBatchSize) {
      console.log("Last batch fetched. Fetching complete.")
      break
    }

    // Prepare for the next batch
    currentOffset += batch.length
  }

  if (allSchools.length === 0) {
    console.log("No schools found or no schools need slugs populated.")
    return
  }

  console.log(`Total schools fetched: ${allSchools.length}. Processing slugs...`)

  const updates = []
  const failedSlugs = []

  for (const school of allSchools) {
    // Only update if slug is null/empty or you want to overwrite
    if (!school.slug) {
      // Check if name exists before slugifying
      if (!school.name || typeof school.name !== 'string' || school.name.trim() === '') {
        console.warn(`Skipping school ID ${school.id}: Name is missing or invalid.`)
        failedSlugs.push({ id: school.id, name: school.name || 'MISSING' })
        continue // Skip to the next school
      }

      const generatedSlug = slugify(school.name)

      // Ensure generated slug is not empty before adding to updates
      if (generatedSlug && generatedSlug.length > 0) {
        updates.push({
          id: school.id,
          slug: generatedSlug,
        })
      } else {
        console.warn(`Could not generate slug for school: ${school.name} (ID: ${school.id})`)
        failedSlugs.push({ id: school.id, name: school.name })
      }
    } else {
      // console.log(`Skipping school ${school.id} - slug already exists: ${school.slug}`);
    }
  }

  if (updates.length === 0) {
    console.log("No schools require slug updates.")
    return
  }

  console.log(`Attempting to update slugs for ${updates.length} schools...`)

  let updatedCount = 0
  let errorCount = 0
  let processedCount = 0

  // Update records one by one using .update()
  for (const update of updates) {
    processedCount++
    console.log(`Updating school ${processedCount}/${updates.length} (ID: ${update.id})...`) // Log progress

    const { error: updateError } = await supabaseAdmin
      .from("schools")
      .update({ slug: update.slug })
      .eq("id", update.id)

    if (updateError) {
      console.error(`Error updating school ID ${update.id}:`, updateError.message)
      errorCount++
      failedSlugs.push({ id: update.id, name: 'N/A - Update Failed' }) // Add to failed list
      // Optional: break loop on first error if preferred
      // break;
    } else {
      updatedCount++
    }
    // Optional: Add a small delay to avoid overwhelming the database/network
    // await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log("----------------------------------------")
  console.log("Slug Population Summary:")
  console.log(`Successfully updated slugs for ${updatedCount} schools.`)
  if (errorCount > 0) {
    console.error(`Failed to update slugs for ${errorCount} schools due to errors during batch updates.`)
  }
  if (failedSlugs.length > 0) {
    console.warn(`Could not generate slugs for ${failedSlugs.length} schools:`, failedSlugs)
  }
  console.log("----------------------------------------")

  console.log("Script finished.")
}

populateSlugs().catch((err) => {
  console.error("Unhandled error running script:", err)
  process.exit(1)
}) 