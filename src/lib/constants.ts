import { API_URL as CONFIG_API_URL, SERVER_URL as CONFIG_SERVER_URL } from '../config/constant';

export const APP_NAME = 'College Management System';
export const API_URL = import.meta.env.VITE_API_URL || CONFIG_API_URL;
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || CONFIG_SERVER_URL;
export const ITEMS_PER_PAGE = 10;

/**
 * Resolves a media path from the backend to a full URL
 * @param path - The media path returned from backend (e.g., '/media/student_profiles/image.jpg')
 * @returns Full URL to the media file or null if path is empty
 * 
 * @example
 * // Backend returns: '/media/student_profiles/photo.jpg'
 * const imageUrl = getMediaUrl(profile.profilePhotoUrl);
 * // Returns: 'http://192.168.2.232:8000/media/student_profiles/photo.jpg'
 */
export const getMediaUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    
    // If path already includes http/https, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    return `${SERVER_URL}/${cleanPath}`;
};
