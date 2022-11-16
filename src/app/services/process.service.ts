import { Injectable } from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first} from "rxjs";
import {ERROR} from "../_enums/ERROR";
import {IProcess, IProcessNew} from "../_interfaces/IProcess";
import {IStage, IStageNew} from "../_interfaces/IStage";
import {STAGETYPE} from "../_enums/STAGETYPE";

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  processList: IProcess[] = [];
  $processList = new BehaviorSubject<IProcess[]>([])
  $processError = new BehaviorSubject<string | null>(null)
  $processToUpdate = new BehaviorSubject<IProcess | null>(null);
  //TODO add/update
  $processToCreate = new BehaviorSubject<IProcessNew | null>(null);

  stage: IStage =   {
    id: 0,
    processId: 0,
    question: "",
    order: 0,
    type: STAGETYPE.textbox
  };

  stageListEdit: IStage[] = [];
  stageList: IStage[] = [];
  $stageError = new BehaviorSubject<string | null>(null);
  $stageList = new BehaviorSubject<IStage[]>([])

  constructor( private httpService: HttpService) {
    this.getAllProcess();
    this.getAllStages();
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

  getAllStages(){
    this.httpService.getStageList().pipe(first()).subscribe({
      next: (stageList) => {this.stageList = stageList;
        this.$stageList.next(stageList)
        console.log(this.processList)
      },
      error: (err) => {
        console.error(err);
        this.$processError.next(ERROR.PROCESSES_HTTP_ERROR);
      }
    });
  }

  getStageById(processId: number){
    this.httpService.getStagesById(processId).pipe(first()).subscribe({
      next: (stageList) => {this.stageList = stageList;
        this.$stageList.next(stageList)
        console.log(this.processList)
      },
      error: (err) => {
        console.error(err);
        this.$processError.next(ERROR.PROCESSES_HTTP_ERROR);
      }
    });

    return this.stageList;
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

  deleteProcess(processId: number) {
    this.httpService.deleteProcess(processId).pipe(first()).subscribe({
      next: () => {
        let newProcessList: IProcess[] = [...this.$processList.getValue()];
          this.$processList.next(
            newProcessList.filter(process => process.id !== processId)
            );
      },
      error: (err) => {
        console.log(err)
        this.$processError.next(ERROR.RESPONSES_HTTP_ERROR)
      }
    })
  }

  updateProcess(processEdit: IProcess) {
    this.httpService.updateProcess(processEdit).pipe(first()).subscribe({
      next: (newProc) => {
          let processList: IProcess[] = [...this.$processList.getValue()];
          this.$processList.next(
            processList.map((product) => {
              if (product.id !== processEdit.id) {
                return product;
              }
              return newProc;
            })
          );
          this.$processToUpdate.next(null);
          this.resetErrorMessages();
        },
          error: (err) => {
          console.error(err);
          this.$processError.next(ERROR.PROCESSES_HTTP_ERROR)
        }
      })
  }

  private resetErrorMessages() {
    this.$processError.next(null)

  }

  createStage(stageNew: IStageNew) {
    console.log(stageNew)

    this.httpService.createStage(stageNew).pipe(first()).subscribe({

      next: (stage) =>{
        let newStageList: IStage[] = [...this.$stageList.getValue()];
        newStageList.push(stage);
        this.$stageList.next(newStageList)
      },
      error: (err) => {
        console.log(err)
        this.$stageError.next(ERROR.STAGES_HTTP_ERROR)
      }
    })

   }
}
