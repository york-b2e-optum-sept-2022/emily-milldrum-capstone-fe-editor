import {IStage} from "./IStage";

export interface IProcess {
  id: number;
  title: string;
  discontinued: boolean;
  stage: IStage[];
}

export interface IProcessNew {
  title: string;
  discontinued: boolean;
  stage: IStage[];
}
