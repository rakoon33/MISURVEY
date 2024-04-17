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
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Address: string;
}

export { CustomerFeedback, FeedbackResponse, ContactInfo };
