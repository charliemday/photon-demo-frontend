
/**
 * Accesses the user's GSC and Drive
 */
export const GOOGLE_EXTERNAL_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_EXTERNAL_CLIENT_ID || "417319515275-8h0f5p130lgg07b8r2r5h680kkmc0oqo.apps.googleusercontent.com"

/**
 * Accesses the user's GSC only
 */
export const GOOGLE_INTERNAL_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_INTERNAL_CLIENT_ID || "895548315740-nuebaespvnfm0oe8h27llv6shc8nga51.apps.googleusercontent.com"

/**
 * Scopes for the external client
 */
export const GOOGLE_EXTERNAL_SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly"
]

/**
 * Scopes for the internal client
 */
export const GOOGLE_INTERNAL_SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/drive.readonly"
];