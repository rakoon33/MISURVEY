import { environment } from '../../../environments/environment';

const BACKEND_API = {
    BASE_API_URL: `${environment.BACKEND_BASE_URL}/api`,
    REGISTER: '/register',
    LOGIN: '/login',
    USER: '/users',
    LOGOUT: '/logout',
    COMPANY: '/companies',
    SURVEY: '/survey',
    CUSTOMER_SURVEY: '/c/f',
    FEEDBACK_RESPONSE: '/responses',
    QUESTION_TEMPLATE: '/questionTemplate'
};

export default {BACKEND_API};
