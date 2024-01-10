import { Survey } from '../../../core/models'; 

export default interface SurveyState {
    surveys: Survey[];
    survey: Survey | null; 
    currentSurveyId: number | null;
    loading: boolean;
    error: string | null;
}