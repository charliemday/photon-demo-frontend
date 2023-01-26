// Backend Local
let ROOT_URL = 'http://localhost:8000';
// Backend Prod
// let ROOT_URL = 'https://baser-backend.herokuapp.com';

let BASE_URL = `${ROOT_URL}/api`;

// Engine Local
let ENGINE_URL = 'http://localhost:8001';
// Engine Prod
// let ENGINE_URL = '';

if (process.env.NODE_ENV === 'production') {
    BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL || ''
    ROOT_URL = process.env.NEXT_PUBLIC_PROD_URL || ''
    ENGINE_URL = process.env.NEXT_PUBLIC_PROD_ENGINE_URL || ''
}

export { BASE_URL, ROOT_URL, ENGINE_URL };