import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  if (!text) {
    return ""
  }
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^\w\-]+/g, "") // remove all non-word chars
    .replace(/\-\-+/g, "-") // replace multiple - with single -
    .replace(/^-+/, "") // trim - from start of text
    .replace(/-+$/, "") // trim - from end of text
}
