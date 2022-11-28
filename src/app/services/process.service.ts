import { Injectable } from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first} from "rxjs";
import {ERROR} from "../_enums/ERROR";
import {IProcess, IProcessNew} from "../_interfaces/IProcess";
import {IStage, IStageNew, IStageOptions} from "../_interfaces/IStage";
import {IResponse} from "../_interfaces/IResponse";
import {provideCloudflareLoader} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  //process variables
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


  //stage variables
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
  $isEditingStage = new BehaviorSubject<boolean>(false);

  //stage:option variables
  $optionError = new BehaviorSubject<string | null>(null);
  $stageOptList = new BehaviorSubject<IStageOptions[]>([]);
  newStageOptList: IStageOptions[] = [];
  stageOption: IStageOptions = {option: ''};

  //response variables
  $viewResponses = new BehaviorSubject<boolean>(false)
  $responseList = new BehaviorSubject<IResponse[]>([])



  constructor( private httpService: HttpService) {
    this.getAllProcess();
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

  //get response list
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
     this.$isCreating.next(false)
     this.resetAll()
     return true;
   }
  }

  //delete an existing process
  deleteProcess(processId: number) {
    this.httpService.deleteProcess(processId).pipe(first()).subscribe({
      next: () => {
        let list: IProcess[] = [...this.$processList.getValue()];
          this.$processList.next(
            list.filter(process => process.id !== processId)
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
          this.resetAll()
        },
          error: (err) => {
          console.error(err);
          this.$processError.next(ERROR.PROCESSES_HTTP_ERROR)
        }
      })
  }

  //reset error messages
  private resetErrorMessages() {
    this.$processError.next(null)
    this.$stageError.next(null)
    this.$optionError.next(null)
  }

  private resetAll(){
    this.$stageList.next([])
    this.$processToUpdate.next(null)
    this.resetErrorMessages()
  }
  //create a new stage
  createStage(stageNew: IStageNew) {

    stageNew.stageOptions = this.newStageOptList;

    //if adding stage to new process
    if(!stageNew.processId){
      let stageCopy = JSON.parse(JSON.stringify(stageNew))
      if(this.stageListCreate == null){ //if stagelist doesnt exist create
        this.stageListCreate = [];
        this.stageListCreate.push(stageCopy);
      } else { //push stage to existing stagelist
        this.stageListCreate.push(stageCopy);
      }
      console.log(this.stageList)
      this.$stageList.next(this.stageListCreate);
    }

    //if adding stage to existing process
    if(stageNew.processId){
      this.httpService.addStage(stageNew).pipe(first()).subscribe({
        next: (stage) =>{
          if(this.$processToUpdate.value !== null){
            let process = {...this.$processToUpdate.value}
            console.log(process)
            process.stage.push(stage);
            console.log(process)
            this.$processToUpdate.next(process);
            return true;
          }
          return true;
        },
        error: (err) => {
          console.log(err)
          this.$processError.next(ERROR.STAGE_ADD_ERROR)
          return false;
        }
      })
    }


    //   let stageCopy = JSON.parse(JSON.stringify(stageNew))
    //   this.stageListCreate.push(stageCopy);
    //   this.$stageList.next(this.stageListCreate);
    //reset the stage option list
       this.newStageOptList = []
    this.$stageOptList.next(this.newStageOptList);
   }

   //delete an existing stage with an id
  deleteStage(stage: IStage) {
    if(stage.id)
    this.httpService.deleteStage(stage.id).pipe(first()).subscribe({
      next: () => {

        console.log('stage deleted')
          let process: IProcess | null = JSON.parse(JSON.stringify(this.$processToUpdate.getValue()));
        if(process !== null){
          const i = process.stage.indexOf(stage);
          process.stage.splice(i, 1);
          console.log('filtered process')
          console.log(process.stage)
          this.$processToUpdate.next(process);
        }
      },
      error: (err) => {
        console.log(err)
        this.$stageError.next(ERROR.STAGES_HTTP_ERROR)
      }
    })
  }

  deleteNewStage(stageNew: IStageNew){
    let list: IStage[] = [...this.$stageList.getValue()];
    console.log(stageNew)
    const i = list.indexOf(stageNew);
    console.log(i)
    if (i > -1){
      list.splice(i, 1)
    }
    this.$stageList.next(list)
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
        this.$isEditingStage.next(false);
        this.$stageToUpdate.next(null);
        this.resetErrorMessages();
      },
      error: (err) => {
        console.error(err);
        this.$stageError.next(ERROR.STAGES_HTTP_ERROR)
      }
    })
  }

  //update an existing stage: option in db
  updateOption(option: IStageOptions) {
    this.httpService.updateOption(option).pipe(first()).subscribe({
      next: (option) => {
        console.log(option)
        this.resetErrorMessages();
      },
      error: (err) => {
        console.error(err);
        this.$stageError.next(ERROR.OPTION_HTTP_ERROR)
      }
    })

  }

  //delete an existing stage: option in db
  deleteOption(id: number) {
    this.httpService.deleteOption(id).pipe(first()).subscribe({
      next: () => {
        let copyOptList: IStageOptions[] = [...this.$stageOptList.getValue()];
        this.$stageOptList.next(
          copyOptList.filter(stageOption => stageOption.id !== id)
        );
        console.log('success')
      },
      error: (err) => {
        console.log(err)
        this.$stageError.next(ERROR.STAGES_HTTP_ERROR)
      }
    })
  }

 // i: number = 0;
  //add new option to new stage
  addOptionNS(choice: IStageOptions) {
    console.log(this.newStageOptList)
    let i = this.newStageOptList.indexOf(this.stageOption);
    if(i > -1){
      this.newStageOptList[i] = choice;
      //
      this.$stageOptList.next(this.newStageOptList)

    } else {
      this.newStageOptList.push(choice)
    }
    console.log(this.newStageOptList)
    this.$stageOptList.next(this.newStageOptList)
    // this.i += 1;
    // console.log(this.i)
  }

  //add new option to existing stage: choice
  addOption(choiceFormat: IStageOptions) {
    this.httpService.addOption(choiceFormat).pipe(first()).subscribe({
      next: () =>{
        let list: IStageOptions[] = [...this.$stageOptList.getValue()];
        list.pop()
        list.push(choiceFormat);
        this.$stageOptList.next(list);
        console.log(list)
      },
      error: (err) => {
        console.log(err)
        this.$processError.next(ERROR.STAGE_ADD_ERROR)
      }
    })
  }

  //delete an option for a new stage
  deleteOptionNS(choice: IStageOptions) {
    console.log('deleting choice')
    console.log(choice)
    console.log(this.newStageOptList)
    const i =this.newStageOptList.indexOf(choice)
    console.log(i)
    if (i > -1){
      this.newStageOptList.splice(i, 1)
    }
    console.log(this.newStageOptList)
  }

}
