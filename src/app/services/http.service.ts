import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IProcess, IProcessNew} from "../_interfaces/IProcess";
import {Observable} from "rxjs";
import {IStage, IStageNew, IStageOptions} from "../_interfaces/IStage";
import {IResponse} from "../_interfaces/IResponse";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }


  //process requests
  getProcessList() {
    return this.httpClient.get('http://localhost:8080/api/process') as Observable<IProcess[]>
  }

  createProcess(process: IProcessNew) {
    return this.httpClient.post('http://localhost:8080/api/process', process) as Observable<IProcess>;
  }
  updateProcess(process: IProcess) {
    return this.httpClient.put('http://localhost:8080/api/process/', process) as Observable<IProcess>;
  }
  deleteProcess(processId: number) {
    return this.httpClient.delete('http://localhost:8080/api/process/' + processId) as Observable<IProcess[]>;
  }

  addStage(stageNew: IStageNew) { //for adding a stage to an existing process
    return this.httpClient.post('http://localhost:8080/api/stage/addToProcess/', stageNew) as Observable<IStage>;
  }


  //stage requests
  createStage(stage: IStageNew) {
    return this.httpClient.post('http://localhost:8080/api/stage', stage) as Observable<IStage>;
  }

  getStageList() {
    return this.httpClient.get('http://localhost:8080/api/stage') as Observable<IStage[]>
  }

  // getStagesById(processId: number) {
  //   return this.httpClient.get('http://localhost:8080/api/stage/byId/' + processId) as Observable<IStage[]>
  // }

  deleteStage(stageId: number) {
    return this.httpClient.delete('http://localhost:8080/api/stage/' + stageId) as Observable<IStage[]>;
  }

  updateStage(stage: IStage) {
    return this.httpClient.put('http://localhost:8080/api/stage/', stage) as Observable<IStage>;
  }


  //stage: stage options
  updateOption(option: IStageOptions) {
    return this.httpClient.put('http://localhost:8080/api/stageOptions/', option) as Observable<IStageOptions>;
  }

  deleteOption(id: number) {
    return this.httpClient.delete('http://localhost:8080/api/stageOptions/' + id) as Observable<IStageOptions[]>;
  }

  //response requests
  getResponseListById(processId: number) {
    return this.httpClient.get('http://localhost:8080/api/response/' + processId) as Observable<IResponse[]>
  }

  addOption(choice: IStageOptions) {  // for adding an option to an existing option
    return this.httpClient.post('http://localhost:8080/api/stageOptions/addToStage/', choice) as Observable<IStage>;
  }
}
