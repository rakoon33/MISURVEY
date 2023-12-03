export default interface Permission {
    IndividualPermissionID: number;
    CompanyUserID: number;
    ModuleID: number;
    CanView: boolean;
    CanAdd: boolean;
    CanUpdate: boolean;
    CanDelete: boolean;
    CanExport: boolean;
    CanViewData: boolean;
    CreatedAt: string;
    CreatedBy: number;
    UpdatedAt: string;
    UpdatedBy: number;
    module: {
      ModuleID: number;
      ModuleName: string;
      ModuleDescription: string;
      CreatedAt: string;
      CreatedBy: number;
      UpdatedAt: string;
      UpdatedBy: number;
    };
  }
  