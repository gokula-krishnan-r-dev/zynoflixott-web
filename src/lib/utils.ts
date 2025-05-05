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
  const displayName = name ? `${name} PRODUCTION` : 'PRODUCTION COMPANY';
  return `https://placehold.co/1200x400/0f172a/f59e0b?text=${encodeURIComponent(displayName)}&font=montserrat`;
};
