import { QuestionTemplate } from '../../models';

export default interface QuestionTemplateState {
  questionTemplates: QuestionTemplate[];
  totalTemplates: number;
  loading: boolean;
  error: string | null;
}
