import { Survey } from '../../../core/models'; 

export default interface SurveyState {
    survey: Survey | null; 
    currentSurveyId: number | null;
    loading: boolean;
    error: string | null;
}