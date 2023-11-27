export default interface AuthState {
  isAuthenticated: boolean,
  error?: any;
  loading: boolean;
  message?: string;
}