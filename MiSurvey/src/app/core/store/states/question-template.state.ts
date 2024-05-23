import { QuestionTemplate } from '../../models';

export default interface QuestionTemplateState {
  questionTemplates: QuestionTemplate[];
  loading: boolean;
  error: string | null;
}
