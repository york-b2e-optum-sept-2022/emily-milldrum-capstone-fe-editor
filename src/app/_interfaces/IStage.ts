import {IQuestionType} from "./IQuestionType";
import {STAGETYPE} from "../_enums/STAGETYPE";

export interface IStage {
  id: number;
  question: string;
  order: number;
  type: STAGETYPE;
}
export interface IStageNew {
  question: string;
  order: number;
  type: STAGETYPE;
}
