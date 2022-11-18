import {Component, Input, OnInit} from '@angular/core';
import {IProcess} from "../../_interfaces/IProcess";
import {first, Subject, takeUntil} from "rxjs";
import {IStage, IStageNew} from "../../_interfaces/IStage";
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
  type: string = "";
  stageOrder: number = 0;
  isEditingStage: boolean = false;
  deleteAlert: string | null = null;
  choiceInput: string = "";

  stageOptions: string[] = [];

  stageEdit: IStage =
    {
      id: 0,
      //processId: 0,
      question: "",
      stageOrder: 0,
      type: "",
      stageOptions: []
    }

  stageNew: IStageNew = {
    //processId: 0,
    question: "",
    stageOrder: 0,
    type: "",
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
      console.log(this.choiceInput)
      console.log(this.stageOptions)
      console.log(this.stageOptions.length)
    }

  }
  //create a new stage check for question, null process, ensure at least 2 options entered
  onCreate() {

    if (this.question == ""){
      this.processService.$stageError.next(ERROR.STAGE_QUESTION_BLANK)
    } else if ((this.type == null) || (this.type == undefined)) {
      this.processService.$stageError.next(ERROR.STAGE_TYPE_SELECT)
    } else if (this.process == null) {
      this.processService.$stageError.next(ERROR.STAGE_PROCESS_NULL)
    } else if (this.type == 'Multiple Choice: Single' && this.stageOptions.length < 2){
      this.processService.$stageError.next(ERROR.STAGE_OPTION_ADD_MORE)
    } else if (this.type == 'Multiple Choice: Multiple' && this.stageOptions.length < 2) {
      this.processService.$stageError.next(ERROR.STAGE_OPTION_ADD_MORE)
    }
    else {
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

  //edit button clicked
  onEdit() {
    this.isEditingStage = true;
  }


  onUpdate() {
      if (this.stage == null) {
        this.processService.$stageError.next(ERROR.STAGE_IS_NULL)
      } else if(this.question == ""){
        this.processService.$stageError.next(ERROR.STAGE_QUESTION_BLANK)
      } else {
        this.stage.question = this.question
        this.stage.type = this.type
        this.stage.stageOrder = this.stageOrder
        this.stage.stageOptions = this.stageOptions
        this.processService.updateStage(this.stage)
        console.log(this.stage)

        this.isEditingStage = false;
    }
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
    if(this.stage == null){
      this.processService.$stageError.next(ERROR.STAGE_IS_NULL)
    } else if (this.stage.id == undefined) {
      this.processService.$stageError.next(ERROR.STAGE_IS_NULL)
    } else {
      this.processService.deleteStage(this.stage.id);
      this.deleteAlert = null; }

  }

}
