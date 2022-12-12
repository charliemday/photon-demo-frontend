
// TODO: Add conditions for Dev and Prod environments
// let BASE_URL = 'https://antler-backend.herokuapp.com/api/'

let ROOT_URL = 'http://localhost:8000';
let ENGINE_URL = 'http://localhost:8001';
let BASE_URL = `${ROOT_URL}/api`;


const xeroClientId = process.env.NEXT_PUBLIC_XERO_CLIENT_ID;
const xeroRedirectUri = process.env.NEXT_PUBLIC_XERO_REDIRECT_URI;
const xeroScopes = "openid accounting.transactions";

// TODO: We should extract this from the API
// OAuth URLs
const OAUTH_URLS = {
    xero: (state: string) => `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${xeroClientId}&redirect_uri=${xeroRedirectUri}&scope=${xeroScopes}&state=${state}`
};

if (process.env.NODE_ENV === 'production') {
    BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL || ''
    ROOT_URL = process.env.NEXT_PUBLIC_PROD_URL || ''
    ENGINE_URL = process.env.NEXT_PUBLIC_PROD_ENGINE_URL || ''
}

export { BASE_URL, OAUTH_URLS, ROOT_URL, ENGINE_URL };