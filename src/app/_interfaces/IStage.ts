import {IQuestionType} from "./IQuestionType";
import {STAGETYPE} from "../_enums/STAGETYPE";

export interface IStage {
  id?: number;
  processId: number;
  question: string;
  stageOrder: number;
  type: STAGETYPE;
  stageOptions: string[];
}
export interface IStageNew {
  processId: number;
  question: string;
  stageOrder: number;
  type: STAGETYPE;
  stageOptions: string[];
}
