interface CustomerFeedback {
  surveyResponses: FeedbackResponse[];
  contactInfo: ContactInfo | null;
}
interface FeedbackResponse {
  SurveyID?: number;
  QuestionID?: number;
  ResponseValue?: string;
}

interface ContactInfo {
  FullName: string;
  Email: string;
  PhoneNumber: string;
}

export { CustomerFeedback, FeedbackResponse, ContactInfo };
