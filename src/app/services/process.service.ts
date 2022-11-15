import { Injectable } from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first} from "rxjs";
import {ERROR} from "../_enums/ERROR";
import {IProcess, IProcessNew} from "../_interfaces/IProcess";

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  processList: IProcess[] = [];
  $processList = new BehaviorSubject<IProcess[]>([])
  $processError = new BehaviorSubject<string | null>(null)

  //TODO add/update
  $processToUpdate = new BehaviorSubject<IProcess | null>(null);
  $processToCreate = new BehaviorSubject<IProcessNew | null>(null);

  constructor( private httpService: HttpService) {
    this.getAllProcess();
  }

  getAllProcess(){
    this.httpService.getProcessList().pipe(first()).subscribe({
      next: (processList) => {this.processList = processList;
        this.$processList.next(processList)
        console.log(this.processList)
      },
      error: (err) => {
        console.error(err);
        this.$processError.next(ERROR.PROCESSES_HTTP_ERROR);
      }
    });
  }

  getProcessList(){
    this.httpService.getProcessList().pipe(first()).subscribe({
      next: (processList) =>{
        this.$processList.next(processList)
    }
    })
  }


  createProcess(processNew: IProcessNew) {

    this.httpService.createProcess(processNew).pipe(first()).subscribe({
      next: (process) =>{
        let newProcessList: IProcess[] = [...this.$processList.getValue()];
        newProcessList.push(process);
        this.$processList.next(newProcessList)
      },
      error: (err) => {
        console.log(err)
        this.$processError.next(ERROR.PROCESS_ADD_ERROR)
      }
    })

  }
}
