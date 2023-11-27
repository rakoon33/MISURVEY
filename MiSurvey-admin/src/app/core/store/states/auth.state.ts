export default interface AuthState {
    status: 'init' | 'authenticated' | 'unauthenticated';
    error?: string;
    loading: boolean;
  }