import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine Tailwind classes safely
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
