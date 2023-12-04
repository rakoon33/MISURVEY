import { User, Permission } from '../../models';

export default interface UserState {
  user: User | null;
  loading: boolean;
  permissions: Permission[];
}
