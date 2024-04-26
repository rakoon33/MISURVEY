import { Customer } from "../../models";

export default interface CustomerManagementState {
    customers: Customer[];
    selectedCustomer?: Customer;
    totalCustomers: number;
    loading: boolean;
    error?: string;
  }