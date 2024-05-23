import { Customer } from "../../models";

export default interface CustomerManagementState {
    customers: Customer[];
    selectedCustomer?: Customer;
    loading: boolean;
    error?: string;
  }