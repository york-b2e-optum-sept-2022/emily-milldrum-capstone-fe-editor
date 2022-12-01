import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IProcess, IProcessNew} from "../_interfaces/IProcess";
import {IStage, IStageNew, IStageOptions} from "../_interfaces/IStage";
import {IResponse} from "../_interfaces/IResponse";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }


  //process requests
  getProcessList() {
    return this.httpClient.get<IProcess[]>('http://localhost:8080/api/process');
  }

  createProcess(process: IProcessNew) {
    return this.httpClient.post<IProcess>('http://localhost:8080/api/process', process);
  }
  updateProcess(process: IProcess) {
    return this.httpClient.put<IProcess>('http://localhost:8080/api/process/', process);
  }
  deleteProcess(processId: number) {
    return this.httpClient.delete<IProcess[]>('http://localhost:8080/api/process/' + processId);
  }

  addStage(stageNew: IStageNew) { //for adding a stage to an existing process
    return this.httpClient.post<IProcess>('http://localhost:8080/api/stage/addToProcess/', stageNew);
  }




  //stage requests
  createStage(stage: IStageNew) {
    return this.httpClient.post<IStage>('http://localhost:8080/api/stage', stage);
  }

  getStageList() {
    return this.httpClient.get<IStage[]>('http://localhost:8080/api/stage');
  }

  // getStagesById(processId: number) {
  //   return this.httpClient.get('http://localhost:8080/api/stage/byId/' + processId) as Observable<IStage[]>
  // }

  deleteStage(stageId: number) {
    return this.httpClient.delete('http://localhost:8080/api/stage/' + stageId);
  }

  updateStage(stage: IStage) {
    return this.httpClient.put<IStage>('http://localhost:8080/api/stage/', stage);
  }




  //stage: stage options
  updateOption(option: IStageOptions) {
    return this.httpClient.put<IStageOptions>('http://localhost:8080/api/stageOptions/', option);
  }

  deleteOption(id: number) {
    return this.httpClient.delete<IStage>('http://localhost:8080/api/stageOptions/' + id);
  }

  //response requests
  getResponseListById(processId: number) {
    return this.httpClient.get<IResponse[]>('http://localhost:8080/api/response/' + processId);
  }

  addOption(choice: IStageOptions) {  // for adding an option to an existing option
    return this.httpClient.post<IStage>('http://localhost:8080/api/stageOptions/addToStage/', choice);
  }
}
