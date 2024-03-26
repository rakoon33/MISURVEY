import {CompanyRole} from '../../models';

export default interface CompanyRolesManagementState {
  companyRoles: CompanyRole[];
  selectedCompanyRole: CompanyRole | null;
  loading: boolean;
  error: string | null;
}
