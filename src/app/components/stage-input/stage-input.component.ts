import {Component, Input, OnInit} from '@angular/core';
import {IProcess, IProcessNew} from "../../_interfaces/IProcess";
import {first, Subject, takeUntil} from "rxjs";
import {IStage, IStageNew} from "../../_interfaces/IStage";
import {STAGETYPE} from "../../_enums/STAGETYPE";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProcessService} from "../../services/process.service";
import {ERROR} from "../../_enums/ERROR";

@Component({
  selector: 'app-stage-input',
  templateUrl: './stage-input.component.html',
  styleUrls: ['./stage-input.component.css']
})
export class StageInputComponent implements OnInit {

  errorMessage: string | null = null;
  @Input()stage: IStage | null = null;
  onDestroy = new Subject();
  question: string = "";
  type: any; //TODO change any
  stageOrder: number = 0;
  isEditingStage: boolean = false;
  deleteAlert: string | null = null;
  choiceInput: string = "";

  stageOptions: string[] = [];

  stageEdit: IStage =
    {
      id: 0,
      processId: 0,
      question: "",
      stageOrder: 0,
      type: STAGETYPE.textbox,
      stageOptions: []
    }

  stageNew: IStageNew = {
    processId: 0,
    question: "",
    stageOrder: 0,
    type: STAGETYPE.textbox,
    stageOptions: [],
  }
  process: IProcess = {
    id: 0,
    title: "",
    discontinued: false,
    stage: [],
  };

  constructor(private modalService: NgbModal, private processService: ProcessService) {

    this.processService.$stageError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage = message);

    this.processService.$processToUpdate.pipe(first()).subscribe(process => {
      if (process != null) {
        this.process = process;
        console.log("selected process")
        console.log(this.process)
      }
    })
  }

  ngOnInit(): void {
    if (this.stage !== null){
      this.question = this.stage.question;
      this.type = this.stage.type;
      this.stageOrder = this.stage.stageOrder;
    }
  }

  //add a response choice
  addChoice() {
    if (this.choiceInput == "" || null){
      this.processService.$stageError.next(ERROR.STAGE_FIELD_BLANK)
    } else {
      this.stageOptions.push(this.choiceInput);
      this.processService.$stageError.next(null)
    }

  }
  //create a new stage
  onCreate() {
    console.log('create clicked')
    console.log(this.process)
    console.log(this.stageOptions)
    if (this.question == ""){
      this.processService.$stageError.next(ERROR.STAGE_QUESTION_BLANK)
    } else if ((this.type == null) || (this.type == undefined)) {
      this.processService.$stageError.next(ERROR.STAGE_TYPE_SELECT)
    } else if (this.process == null) {
      this.processService.$stageError.next(ERROR.STAGE_PROCESS_NULL)
    } else if (this.stageOptions.length < 2){
      this.processService.$stageError.next(ERROR.STAGE_OPTION_ADD_MORE)
    }
    else {

      this.stageNew.processId = this.process.id
      this.stageNew.question = this.question;
      this.stageNew.stageOrder = this.stageOrder;
      this.stageNew.type = this.type;
      this.stageNew.stageOptions = this.stageOptions;
      this.processService.createStage(this.stageNew);
      this.processService.$processToUpdate.next(null);
      this.processService.$stageError.next(null)
      this.closeThis();
    }
  }



  onUpdate() {
    console.log(this.process.stage)
    this.isEditingStage = true;
    // if(this.process == null){
    //   this.processService.$processError.next(ERROR.PROCESS_NULL)
    // } else if (this.title == ""){
    //   this.processService.$processError.next(ERROR.PROCESS_TITLE)
    // }
    // else
    // {
    //   this.processEdit = {
    //     id: this.process.id,
    //     title: this.title,
    //     discontinued: this.discontinued,
    //     stages: this.process.stages,
    //   }
    //   this.processService.updateProcess(this.processEdit)
    //   this.closeThis();
   // }
    //this.processService.$processToUpdate.next(null);

  }


  //unsubscribing
  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  //for closing the editting option
  closeThis() {
    this.isEditingStage = false;
    this.processService.$processToUpdate.next(null);
  }

  //confirm delete
  onDelete() {
    this.deleteAlert = "Are you sure you wish to delete?\n" +
      "Deleting a stage will remove all answers, if you wish to save previous responses update this field instead"
  }

  //execute delete after confirm
  onDeleteConfirm() {
    this.processService.deleteProcess(this.process.id);
    this.deleteAlert = null;
  }

}
