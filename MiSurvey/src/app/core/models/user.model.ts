export default interface User {
  UserID?: number;
  UserAvatar?: string; 
  Username: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber?: string; 
  UserPassword?: string; 
  UserRole: string;
  CreatedAt: Date | string; 
  LastLogin?: Date | string;
  IsActive: number;
  CreatedBy?: number; 
  UpdatedAt?: Date | string; 
  UpdatedBy?: number; 
  Gender?: string; 
}
