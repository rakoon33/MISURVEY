import { User, Permission, UserPackage } from '../../models';

export default interface UserState {
  user: User | null;
  loading: boolean;
  permissions: Permission[];
  packages: UserPackage | null;
}
