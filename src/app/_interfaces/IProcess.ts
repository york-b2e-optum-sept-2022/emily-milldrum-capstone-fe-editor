import {IStage} from "./IStage";

export interface IProcess {
  id: number;
  title: string;
  discontinued: boolean;
  stages: IStage[];
}

export interface IProcessNew {
  title: string;
  discontinued: boolean;
  stages: IStage[];
}
