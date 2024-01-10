import { environment } from '../../../environments/environment';

const BACKEND_API = {
    BASE_API_URL: `${environment.BACKEND_BASE_URL}/api`,
    REGISTER: '/register',
    LOGIN: '/login',
    USER: '/users',
    LOGOUT: '/logout',
    COMPANY: '/companies',
    SURVEY: '/survey',
};

export default {BACKEND_API};
