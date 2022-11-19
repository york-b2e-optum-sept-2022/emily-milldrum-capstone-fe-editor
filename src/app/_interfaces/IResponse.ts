import {IProcess} from "./IProcess";
import {IAnswer} from "./IAnswer";

export interface IResponse {
  id: number;
  process: IProcess
  answer: IAnswer[];
}
