import { User, Permission } from '../../models';

export default interface UserState {
  user: User | null;
  error?: any;
  loading: boolean;
  permissions: Permission[];
}
