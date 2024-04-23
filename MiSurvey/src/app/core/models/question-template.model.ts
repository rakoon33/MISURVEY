export default interface QuestionTemplate {
    TemplateID: number;
    TemplateCategory: string;
    TemplateText: string;
    SurveyTypeID: number;
    CreatedAt?: Date;
    CreatedBy?: number;
    UpdatedAt?: Date;
    UpdatedBy?: number;
    SurveyType?: any;
  }
  