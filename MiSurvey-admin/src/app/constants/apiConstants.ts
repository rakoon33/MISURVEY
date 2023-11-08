import { environment } from '../../environments/environment';

export const BACKEND_API = {
    BASE_API_URL: `${environment.BACKEND_BASE_URL}/api`,
    REGISTER: '/register',
    LOGIN: '/login',
    USER: '/user',
    COMPANY: '/companies',
};
