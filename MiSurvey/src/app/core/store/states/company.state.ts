import { Company, Permission } from '../../models';

export default interface UserState {
  company: Company | null;
  loading: boolean;
  permissions: Permission[];
}
