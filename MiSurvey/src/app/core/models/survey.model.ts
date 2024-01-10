interface SurveyType {
    SurveyTypeID?: number;
    SurveyTypeName: string;
    SurveyTypeDescription: string;
    ResponseType: string;
    CreatedAt: Date;
}

interface Survey {
    SurveyID?: number;
    UserID?: number;
    CompanyID?: number;
    Title?: string;
    SurveyDescription?: string;
    SurveyImages?: string;
    InvitationMethod?: string;
    SurveyStatus?: string;
    Customizations?: any; 
    StartDate?: Date;
    EndDate?: Date;
    ResponseRate?: number;
    CreatedBy?: number;
    Approve?: string;
    pages?: SurveyPage[]; // Array of Pages
    CreatedAt?: Date;
    UpdatedAt?: Date;
    UpdatedBy?: number;
}

interface SurveyPage {
    PageID?: number;
    SurveyID?: number;
    PageOrder?: number;
    question?: SurveyQuestion; // Array of Questions
}

interface SurveyQuestion {
    QuestionID?: number;
    PageID?: number;
    QuestionText?: string;
    QuestionType?: number; // Referencing SurveyTypeID
}


interface SurveyResponse {
    ResponseID?: number;
    CustomerID?: number;
    SurveyID: number;
    QuestionID: number;
    ResponseValue?: string;
    CreatedAt: Date;
}

interface SurveyDetail {
    SurveyDetailID?: number;
    SurveyID?: number;
    SentBy: number;
    SentAt: Date;
    RecipientCount: number;
    Recipients: string; // This could be a JSON string or an array
    CompanyID?: number;
}

interface SurveyReport {
    ReportID?: number;
    UserID?: number;
    SurveyID?: number;
    FeedbacksCount: number;
    AverageRating: number;
    CreatedAt: Date;
    ReportFrequency: number;
    ExpiredDays: number;
    SurveyDetailID: number;
    CompanyID?: number;
    CreatedBy?: number;
    UpdatedAt?: Date;
    UpdatedBy?: number;
}

export { SurveyType, Survey, SurveyPage, SurveyQuestion, SurveyResponse, SurveyDetail, SurveyReport };
