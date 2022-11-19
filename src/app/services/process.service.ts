import { Injectable } from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first} from "rxjs";
import {ERROR} from "../_enums/ERROR";
import {IProcess, IProcessNew} from "../_interfaces/IProcess";
import {IStage, IStageNew} from "../_interfaces/IStage";
import {IResponse} from "../_interfaces/IResponse";

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  process: IProcess =   {
    id: 0,
    title: "",
    discontinued: false,
    stage: [],
  };
  processList: IProcess[] = [];
  $processList = new BehaviorSubject<IProcess[]>([])
  $processError = new BehaviorSubject<string | null>(null)
  $processToUpdate = new BehaviorSubject<IProcess | null>(null);

  stage: IStage =   {
    id: 0,
    //processId: 0,
    question: "",
    stageOrder: 0,
    type: "",
    stageOptions: []
  };

  stageListCreate: IStageNew[] | null = null;
  stageList: IStage[] = [];
  $stageError = new BehaviorSubject<string | null>(null);
  $stageToUpdate = new BehaviorSubject<IStage | null>(null);
  $stageList = new BehaviorSubject<IStage[]>([])
  $isCreating = new BehaviorSubject<boolean>(false)


  $viewResponses = new BehaviorSubject<boolean>(false)

  $responseList = new BehaviorSubject<IResponse[]>([])

  constructor( private httpService: HttpService) {
    this.getAllProcess();
    //this.getAllStages();
  }


  //get a list of all processes
  getAllProcess(){
    this.httpService.getProcessList().pipe(first()).subscribe({
      next: (processList) => {this.processList = processList;
        this.$processList.next(processList)
      },
      error: (err) => {
        console.error(err);
        this.$processError.next(ERROR.PROCESSES_HTTP_ERROR);
      }
    });
  }

  //get a list of all stages
  getAllStages(){
    this.httpService.getStageList().pipe(first()).subscribe({
      next: (stageList) => {this.stageList = stageList;
        this.$stageList.next(stageList)
      },
      error: (err) => {
        console.error(err);
        this.$processError.next(ERROR.PROCESSES_HTTP_ERROR);
      }
    });
  }

  getResponseList(selectedProcess: IProcess){
    this.httpService.getResponseListById(selectedProcess.id).pipe(first()).subscribe({
      next: (responseList) => {
        this.$responseList.next(responseList)
        console.log(responseList)
      },
      error: (err) => {
        console.error(err);
        this.$processError.next(ERROR.PROCESSES_HTTP_ERROR);
      }
    });
  }

  //create a new process
  createProcess(processNew: IProcessNew) {
    //if stage is empty throw this error
   if(this.stageListCreate == null){
     this.$processError.next(ERROR.PROCESS_ADD_STAGE)
     return false;
   } else {     //set stages
     processNew.stage = this.stageListCreate;
     console.log('ps after pushing stages to process')
     console.log(processNew.stage)

   console.log('ps what gets sent to http service')
   console.log(processNew);
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
     this.stageListCreate = [];
     this.$processError.next(null)
     this.$isCreating.next(false)
     this.$processToUpdate.next(null);
     return true;
   }
  }

  //delete an existing process
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

  //update existing process
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

  //rest error messages
  private resetErrorMessages() {
    this.$processError.next(null)
    this.$stageError.next(null)

  }

  //create a new stage
  createStage(stageNew: IStageNew) {
    console.log('create ps: stagenew')
    console.log(stageNew)
    if(this.stageListCreate == null){
      this.stageListCreate = [];
    }

    this.stageListCreate.push(stageNew);
    this.$stageList.next(this.stageListCreate);
    console.log('create ps: stageListCrreate')
    console.log(this.stageListCreate)
   }


   //delete an existing stage
  deleteStage(id: number) {
    this.httpService.deleteStage(id).pipe(first()).subscribe({
      next: () => {
        let newStageList: IStage[] = [...this.$stageList.getValue()];
        this.$stageList.next(
          newStageList.filter(stage => stage.id !== id)
        );
      },
      error: (err) => {
        console.log(err)
        this.$stageError.next(ERROR.STAGES_HTTP_ERROR)
      }
    })
  }

  //update an existing stage
  updateStage(stage: IStage) {
    this.httpService.updateStage(stage).pipe(first()).subscribe({
      next: (newStage) => {
        let stageList: IStage[] = [...this.$stageList.getValue()];
        this.$stageList.next(
          stageList.map((incStage) => {
            if (incStage.id !== stage.id) {
              return stage;
            }
            return newStage;
          })
        );
        this.$stageToUpdate.next(null);
        this.resetErrorMessages();
      },
      error: (err) => {
        console.error(err);
        this.$stageError.next(ERROR.STAGES_HTTP_ERROR)
      }
    })
  }
}
