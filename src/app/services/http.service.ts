import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IProcess, IProcessNew} from "../_interfaces/IProcess";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

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
}
