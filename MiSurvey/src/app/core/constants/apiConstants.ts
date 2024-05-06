import { environment } from '../../../environments/environment';

const BACKEND_API = {
    BASE_API_URL: `${environment.BACKEND_BASE_URL}/api`,
    BASE_API_URL_PAYMENT: `${environment.BACKEND_BASE_URL}`,
    REGISTER: '/register',
    LOGIN: '/login',
    USER: '/users',
    LOGOUT: '/logout',
    COMPANY: '/companies',
    SURVEY: '/survey',
    CUSTOMER_SURVEY: '/c/f',
    FEEDBACK_RESPONSE: '/responses',
    QUESTION_TEMPLATE: '/questionTemplate',
    REPORTS: '/dashboard',
    SERVICEPACKAGES: '/servicepackages'
};

export default {BACKEND_API};
