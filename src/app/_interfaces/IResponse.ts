import {IProcess} from "./IProcess";
import {IAnswer} from "./IAnswer";

export interface IResponse {
  id: number;
  processes: IProcess
  answer: IAnswer[];
}
