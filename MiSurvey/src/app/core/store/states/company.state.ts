import { Company } from '../../models';

export default interface CompanyState {
  company: Company | null;
  loading: boolean;
}
