export const extractSubdomain = (url: string): string => {
    /**
     * This function takes a url and returns the subdomain
     */
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    if (parts.length > 2) {
        return parts.slice(0, -2).join('.');
    } else {
        return '';
    }
}
