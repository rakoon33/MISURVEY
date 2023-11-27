import { User } from '../../models';

export default interface UserState {
  user: User | null;
  error?: any;
  loading: boolean;
  message?: string;
}
