import { Survey } from '../../../core/models'; 

export default interface CustomerSurveyState {
    survey: Survey | null; 
    currentSurveyId: number | null;
    loading: boolean;
    error: string | null;
}