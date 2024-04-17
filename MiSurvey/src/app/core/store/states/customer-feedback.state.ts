import { FeedbackResponse, ContactInfo } from '../../models';

export default interface CustomerFeedbackState {
  surveyResponses: FeedbackResponse[];
  contactInfo: ContactInfo | null;
  loading: boolean;
  error: string | null;
}
