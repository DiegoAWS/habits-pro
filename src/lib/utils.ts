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

  // Create lighter version with more sophistication
  const lighterR = Math.min(255, Math.round(r + (255 - r) * 0.4));
  const lighterG = Math.min(255, Math.round(g + (255 - g) * 0.4));
  const lighterB = Math.min(255, Math.round(b + (255 - b) * 0.4));

  // Create darker version with more depth
  const darkerR = Math.round(r * 0.6);
  const darkerG = Math.round(g * 0.6);
  const darkerB = Math.round(b * 0.6);

  // Create vibrant accent color
  const accentR = Math.min(255, Math.round(r * 1.3));
  const accentG = Math.min(255, Math.round(g * 1.1));
  const accentB = Math.min(255, Math.round(b * 1.2));

  // Create sophisticated achievement color (golden/warm tones)
  const achievedR = Math.min(255, Math.round(r * 0.8 + 80));
  const achievedG = Math.min(255, Math.round(g * 0.9 + 60));
  const achievedB = Math.max(0, Math.round(b * 0.7 + 20));

  // Create subtle secondary color for depth
  const secondaryR = Math.min(255, Math.round(r * 1.1 + 30));
  const secondaryG = Math.min(255, Math.round(g * 0.95 + 20));
  const secondaryB = Math.min(255, Math.round(b * 1.05 + 25));

  return {
    base: `${r}, ${g}, ${b}`,
    lighter: `${lighterR}, ${lighterG}, ${lighterB}`,
    darker: `${darkerR}, ${darkerG}, ${darkerB}`,
    accent: `${accentR}, ${accentG}, ${accentB}`,
    achieved: `${achievedR}, ${achievedG}, ${achievedB}`,
    secondary: `${secondaryR}, ${secondaryG}, ${secondaryB}`,
  };
};
