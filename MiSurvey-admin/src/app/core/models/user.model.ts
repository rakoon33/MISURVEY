export default interface User {
  UserID?: number; // Optional because it's auto-incremented
  UserAvatar?: string; // Optional because it may not be set by the user
  Username: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber?: string; // Optional as it might not be provided
  UserPassword?: string; // This should not be sent to the frontend for security reasons
  UserRole: string;
  CreatedAt: Date | string; // Depending on how you handle dates, you may need to adjust this
  LastLogin?: Date | string; // Optional and also depending on date handling
  IsActive: boolean;
  CreatedBy?: number; // Optional as this may not always be provided
  UpdatedAt?: Date | string; // Optional and depending on date handling
  UpdatedBy?: number; // Optional as this may not always be provided
}