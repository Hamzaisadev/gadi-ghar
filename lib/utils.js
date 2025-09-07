import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Generate placeholder logo URL using first letter of name
export function generatePlaceholderLogo(name) {
  if (!name) return null;
  const firstLetter = name.charAt(0).toUpperCase();
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Using a placeholder service that generates logos with initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstLetter)}&background=${randomColor.substring(1)}&color=ffffff&size=200&font-size=0.8&bold=true&format=svg`;
}