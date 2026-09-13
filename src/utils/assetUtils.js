/**
 * Resolves an asset path or URL into a fully-qualified URL for browser rendering.
 * Handles:
 * - full http/https URLs
 * - data URLs
 * - blob URLs
 * - frontend static assets (/images/..., /assets/...)
 * - backend relative storage paths ('branding/...', '/storage/branding/...')
 */
export const getAssetUrl = (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return url;

    // Absolute URLs, Data URLs, Blob URLs
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    // Frontend public assets (e.g. /images/..., /favicon.ico, /vite.svg)
    if (url.startsWith('/images/') || url.startsWith('/icons/') || url.startsWith('/assets/')) {
        return url;
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    const serverOrigin = apiBase.replace(/\/api\/v1\/?$/, '');

    // Backend storage paths
    if (url.startsWith('/storage/')) {
        return `${serverOrigin}${url}`;
    }
    if (url.startsWith('storage/')) {
        return `${serverOrigin}/${url}`;
    }

    // Relative paths like 'branding/...' or 'avatars/...'
    const cleanPath = url.startsWith('/') ? url : `/storage/${url}`;
    return `${serverOrigin}${cleanPath}`;
};

/**
 * Converts an image URL (or asset path) to a Base64 data URL for PDF generation and embedding.
 */
export const convertUrlToBase64 = async (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return url;
    if (url.startsWith('data:')) return url;

    const fullUrl = getAssetUrl(url);
    try {
        const response = await fetch(fullUrl, { mode: 'cors' });
        if (!response.ok) {
            console.warn(`convertUrlToBase64 failed: HTTP ${response.status} for ${fullUrl}`);
            return fullUrl;
        }
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(fullUrl);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn('convertUrlToBase64 network or CORS error, falling back to URL:', e);
        return fullUrl;
    }
};
