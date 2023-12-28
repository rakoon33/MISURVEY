import { Company, Permission } from '../../models';

export default interface CompanyState {
  company: Company | null;
  loading: boolean;
  permissions: Permission[];
}
