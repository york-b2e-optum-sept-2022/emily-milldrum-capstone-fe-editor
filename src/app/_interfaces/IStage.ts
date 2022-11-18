export interface IStage {
  id?: number;
 // processId: number;
  question: string;
  stageOrder: number;
  type: string;
  stageOptions: string[];
}
export interface IStageNew {
  //processId: number;
  question: string;
  stageOrder: number;
  type: string;
  stageOptions: string[];
}
