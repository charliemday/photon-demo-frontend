
import { IS_PROD } from './core';

// Local Development
let ROOT_URL = 'http://localhost:8000';
let BASE_FRONTEND_URL = 'http://localhost:3000';
let ENGINE_URL = 'http://localhost:8001';
let BASE_URL = `${ROOT_URL}/api`;
let MARKETING_SITE_URL = 'https://getbaser.com';


// Production Development
// let ROOT_URL = 'https://baser-backend.herokuapp.com';

if (IS_PROD) {
    BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL || ''
    ROOT_URL = process.env.NEXT_PUBLIC_PROD_URL || ''
    ENGINE_URL = process.env.NEXT_PUBLIC_PROD_ENGINE_URL || ''
    BASE_FRONTEND_URL = process.env.NEXT_PUBLIC_PROD_FRONTEND_URL || ''
    MARKETING_SITE_URL = process.env.NEXT_PUBLIC_PROD_MARKETING_URL || MARKETING_SITE_URL
}

const PRIVACY_POLICY_URL = `${MARKETING_SITE_URL}/privacy-policy`;
const TERMS_OF_SERVICE_URL = `${MARKETING_SITE_URL}/terms-and-conditions`;

export { BASE_URL, ROOT_URL, ENGINE_URL, BASE_FRONTEND_URL, PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL, MARKETING_SITE_URL };
