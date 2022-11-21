export interface IStage {
  id?: number;
  question: string;
  stageOrder: number;
  type: string;
  stageOptions: IStageOptions[];
}
export interface IStageNew {
  question: string;
  stageOrder: number;
  type: string;
  stageOptions: IStageOptions[];
  processId?: number;
}

export interface IStageOptions {
  id?: number,
  option: string
  stageId?: number,
}
