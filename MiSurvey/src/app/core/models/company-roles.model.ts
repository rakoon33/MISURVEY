import Permission from "./permission.model";

export default interface CompanyRole {
    CompanyRoleID?: number;
    CompanyRoleName: string;
    CompanyRoleDescription?: string;
    CreatedAt?: Date;
    CreatedBy?: number;
    UpdatedAt?: Date;
    UpdatedBy?: number;
    permissions?: Permission[];
  }