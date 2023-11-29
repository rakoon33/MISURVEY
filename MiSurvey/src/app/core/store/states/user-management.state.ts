import {User} from '../../models';

export default interface UserManagementState {
  users: User[];
  loading: boolean;
  error: any;
  selectedUser: User | null; 
}