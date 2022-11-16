import {IQuestionType} from "./IQuestionType";
import {STAGETYPE} from "../_enums/STAGETYPE";

export interface IStage {
  id: number;
  processId: number;
  question: string;
  order: number;
  type: STAGETYPE;
}
export interface IStageNew {
  processId: number;
  question: string;
  order: number;
  type: STAGETYPE;
}
