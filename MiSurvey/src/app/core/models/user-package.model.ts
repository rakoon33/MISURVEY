interface ServicePackage {
  PackageID: number;
  PackageName: string;
  Features: string;
  Price: number;
  Duration: number;
  CreatedAt: Date | string;
  CreatedBy?: number;
  UpdatedAt?: Date | string;
  UpdatedBy?: number;
  SurveyLimit: number;
  ResponseLimit: number;
  ShareMethod: string;
}

interface UserPackage {
  UserPackageID: number;
  PackageID: number;
  StartDate: Date | string;
  EndDate: Date | string | null;
  CompanyID: number;
  servicePackage: ServicePackage;
}

export { ServicePackage, UserPackage };
