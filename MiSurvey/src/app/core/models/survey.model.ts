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
    CreatedAt?: Date;
    ResponseRate?: number;
    CreatedBy?: number;
    UpdatedAt?: Date;
    UpdatedBy?: number;
    Approve?: string;
    SurveyLink?: string;
    SurveyQuestions?: SurveyQuestion[];
}

interface SurveyType {
    SurveyTypeID?: number;
    SurveyTypeName: string;
    SurveyTypeDescription: string;
    ResponseType: string;
    CreatedAt: Date;
}

interface SurveyQuestion {
    QuestionID?: number;
    QuestionText?: string;
    QuestionType?: number; // This should reference SurveyTypeID
    PageOrder?: number;
    SurveyID?: number;
}

interface SurveyResponse {
    ResponseID?: number;
    CustomerID?: number;
    CreatedAt: Date;
}

export { SurveyType, Survey, SurveyQuestion, SurveyResponse, };
