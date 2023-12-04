import {User} from '../../models';

export default interface UserManagementState {
  users: User[];
  loading: boolean;
  selectedUser: User | null;
  totalUsers: number;
}