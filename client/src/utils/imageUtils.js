/**
 * Fix image URL protocol to match current environment
 * Replaces https:// with http:// in development
 */
export const fixImageUrl = (url) => {
    if (!url) return url;

    // In development, replace https with http
    if (process.env.NODE_ENV !== 'production' && url.startsWith('https://localhost')) {
        return url.replace('https://', 'http://');
    }

    return url;
};
