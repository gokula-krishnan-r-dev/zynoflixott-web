import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "./axios";
import { userId } from "./user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchUser = async () => {
  const res = await axios.get("/auth/user/" + userId);
  return res.data.user;
};

/**
 * Comprehensive image URL cleaner that handles various image sources
 * @param url The image URL to clean
 * @returns The cleaned URL ready for display
 */
export const cleanImageUrl = (url?: string): string => {
  if (!url) return '';

  try {
    // Handle Azure Blob Storage URLs (remove SAS tokens and query params)
    if (url.includes('blob.core.windows.net')) {
      // Extract just the base URL without query parameters
      return url.split('?')[0];
    }

    // Handle general URLs with query parameters
    if (url.includes('?')) {
      return url.split('?')[0];
    }

    return url;
  } catch (error) {
    console.error('Error cleaning image URL:', error);
    return url; // Return original URL if something goes wrong
  }
};

/**
 * Get a profile image with fallback
 * @param imageUrl The primary image URL
 * @param name The name to use for the placeholder
 * @returns A working image URL
 */
export const getProfileImage = (imageUrl?: string, name?: string): string => {
  if (imageUrl) {
    return cleanImageUrl(imageUrl);
  }

  // Create a placeholder with the name
  const displayName = name || 'Profile';
  return `https://placehold.co/400x400/1f2937/f59e0b?text=${encodeURIComponent(displayName)}&font=montserrat`;
};

/**
 * Get a background image with fallback
 * @param imageUrl The primary image URL
 * @param name The name to use for the placeholder
 * @returns A working image URL
 */
export const getBackgroundImage = (imageUrl?: string, name?: string): string => {
  if (imageUrl) {
    return cleanImageUrl(imageUrl);
  }

  // Create a placeholder with the name
  const displayName = name ? `${name}` : 'PRODUCTION COMPANY';
  return `https://placehold.co/1200x400/0f172a/f59e0b?text=${encodeURIComponent(displayName)}&font=montserrat`;
};

/**
 * Format a number to a compact representation (e.g., 5K, 5L, 1M)
 * Supports both Western (K, M, B) and Indian (L, Cr) number systems
 * 
 * @param number The number to format
 * @param useIndianFormat Whether to use Indian number formatting (lakhs, crores)
 * @returns Formatted string
 */
export function formatNumber(number: number, useIndianFormat: boolean = false): string {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }

  // For very small numbers, just return the number
  if (Math.abs(number) < 1000) {
    return number.toString();
  }

  // For Indian number format (lakhs and crores)
  if (useIndianFormat) {
    if (number >= 10000000) { // 1 crore (10^7)
      return (number / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    }
    if (number >= 100000) { // 1 lakh (10^5)
      return (number / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    }
    if (number >= 1000) { // 1 thousand
      return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
  }
  // For Western number format (thousands, millions, billions)
  else {
    const units = ['', 'K', 'M', 'B', 'T'];
    const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3);

    if (unitIndex >= units.length) {
      return number.toString(); // If number is too large, return as is
    }

    const divisor = Math.pow(10, unitIndex * 3);
    const formattedValue = (number / divisor).toFixed(1).replace(/\.0$/, '');

    return formattedValue + units[unitIndex];
  }

  return number.toString();
}
