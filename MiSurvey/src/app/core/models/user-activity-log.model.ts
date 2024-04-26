export default interface UserActivityLog {
    LogID: number;
    UserID: number;
    UserAction: string;
    ActivityDescription: string;
    TableName: string;
    CreatedAt: Date;
    CompanyID: number | null;
  }
  