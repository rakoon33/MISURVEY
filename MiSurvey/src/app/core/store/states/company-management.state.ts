import { Company } from '../../models';

export default interface CompanyManagementState {
  companies: Company[];
  loading: boolean;
  selectedCompany: Company | null;
}