// Local Development
let ROOT_URL = 'http://localhost:8000';
let BASE_FRONTEND_URL = 'http://localhost:3000';
let ENGINE_URL = 'http://localhost:8001';
let BASE_URL = `${ROOT_URL}/api`;

// Production Development
// let ROOT_URL = 'https://baser-backend.herokuapp.com';

if (process.env.NODE_ENV === 'production') {
    BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL || ''
    ROOT_URL = process.env.NEXT_PUBLIC_PROD_URL || ''
    ENGINE_URL = process.env.NEXT_PUBLIC_PROD_ENGINE_URL || ''
    BASE_FRONTEND_URL = process.env.NEXT_PUBLIC_PROD_FRONTEND_URL || ''
}

export { BASE_URL, ROOT_URL, ENGINE_URL, BASE_FRONTEND_URL };
