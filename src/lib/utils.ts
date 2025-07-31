import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to parse RGB string to array
export const parseRgb = (rgbString: string): [number, number, number] => {
  const [r, g, b] = rgbString.split(',').map(Number);
  return [r, g, b];
};

// Function to create color variations for gradients
export const createColorVariations = (rgbString: string) => {
  const [r, g, b] = parseRgb(rgbString);

  // Create lighter version (mix with white)
  const lighterR = Math.min(255, Math.round(r + (255 - r) * 0.3));
  const lighterG = Math.min(255, Math.round(g + (255 - g) * 0.3));
  const lighterB = Math.min(255, Math.round(b + (255 - b) * 0.3));

  // Create darker version
  const darkerR = Math.round(r * 0.7);
  const darkerG = Math.round(g * 0.7);
  const darkerB = Math.round(b * 0.7);

  // Create saturated version for achievements (shift towards warm colors)
  const achievedR = Math.min(255, Math.round(r * 1.2 + 50));
  const achievedG = Math.min(255, Math.round(g * 0.9 + 30));
  const achievedB = Math.max(0, Math.round(b * 0.8));

  return {
    base: `${r}, ${g}, ${b}`,
    lighter: `${lighterR}, ${lighterG}, ${lighterB}`,
    darker: `${darkerR}, ${darkerG}, ${darkerB}`,
    achieved: `${achievedR}, ${achievedG}, ${achievedB}`,
  };
};
