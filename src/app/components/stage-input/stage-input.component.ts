import {Component, Input, OnInit} from '@angular/core';
import {IProcess} from "../../_interfaces/IProcess";
import {first, Subject, takeUntil} from "rxjs";
import {IStage, IStageNew, IStageOptions} from "../../_interfaces/IStage";
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
  errorMessage2: string | null = null;
  onDestroy = new Subject();


  @Input()stage: IStage | null = null;

  question: string = "";
  type: string = "";
  stageOrder: number = 0;
  isEditingStage: boolean = false;
  deleteAlert: string | null = null;
  choiceInput: string = "";
  stageOptCount: number = 0;

  creatingOptions: IStageOptions = {option: ""};

  stageOptions: IStageOptions[] = [];

  stageEdit: IStage =
    {
      id: 0,
      question: "",
      stageOrder: 0,
      type: "",
      stageOptions: []
    }

  stageNew: IStageNew = {
    question: "",
    stageOrder: 0,
    type: "",
    stageOptions: []
  }

  process: IProcess | null = null;

  stageOption: IStageOptions = {
    option: ""
  };

  constructor(private modalService: NgbModal, private processService: ProcessService) {

    this.processService.$stageError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage = message);
    this.processService.$optionError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage2 = message);
    this.processService.$isEditingStage.pipe(takeUntil(this.onDestroy)).subscribe(status => this.isEditingStage = status);

    this.processService.$processToUpdate.pipe(first()).subscribe(process => {
      if (process != null) {
        this.process = process;
      }
    })
    this.processService.$stageOptList.pipe(takeUntil(this.onDestroy)).subscribe(stageOptions => this.stageOptions = stageOptions);

  }

  ngOnInit(): void {
    this.processService.$stageError.next(null)
    if (this.stage !== null){
      this.question = this.stage.question;
      this.type = this.stage.type;
      this.stageOrder = this.stage.stageOrder;
    }
    if(this.stage?.stageOptions){
      this.stageOptions = this.stage?.stageOptions
    this.stageOptCount = this.stageOptions.length}


  }

  //create a new stage check for question, null process, ensure at least 2 options entered
  onCreate() {
    let blankOpt = false;
    this.stageOptions.forEach(i =>
    {
      if (i.option == ''){
        blankOpt = true;
      }
    })

    if (this.question == ""){
      this.processService.$stageError.next(ERROR.STAGE_QUESTION_BLANK)
    } else if (this.type == "") {
      this.processService.$stageError.next(ERROR.STAGE_TYPE_SELECT)
    } else if (blankOpt)    {
      this.processService.$optionError.next(ERROR.OPTION_VALUE_EMPTY)
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
      //if there is no process TODO
      if(this.process !== null){
        this.stageNew.processId = this.process.id;
      }
      this.processService.createStage(this.stageNew);

        //reset
        if (this.errorMessage2 == null){
          this.processService.$stageError.next(null)
          this.question = "";
          this.type = "";
          this.choiceInput = "";
          this.stageOrder = 0;
          this.stageOptions = []
          this.closeThis();}


    }
  }

  //edit button clicked
  onEdit() {
    this.processService.$stageToUpdate.next(this.stage);
    this.isEditingStage = true;
  }

  //update this stage
  onUpdate() {
    console.log(this.stageOptions)
      this.processService.$stageOptList.next(this.stageOptions)
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
    }
  }

  //delete a new stage without an id
  onDeleteNew() {
    console.log('deleting new')
    console.log(this.stage)
    if(this.stage == null){
      this.processService.$stageError.next(ERROR.STAGE_IS_NULL)
    } else {
      this.processService.deleteNewStage(this.stage);
      this.deleteAlert = null; }
  }

  //confirm delete
  onDelete() {
    this.deleteAlert = "Are you sure you wish to delete?\n" +
      "Deleting a stage will remove all answers, if you wish to save previous responses update this field instead"
  }

  //execute delete after confirm
  onDeleteConfirm() {
    this.processService.$stageOptList.next(this.stageOptions)
    if(this.stage == null){
      this.processService.$stageError.next(ERROR.STAGE_IS_NULL)
    } else if (this.stage.id == undefined) {
      this.processService.$stageError.next(ERROR.STAGE_IS_NULL)
    } else {
      this.processService.deleteStage(this.stage);
      this.deleteAlert = null; }

  }

  //generate a new field to fill
  addField() {
    this.stageOptions.push({option: ""});
  }

  //unsubscribing
  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  //for closing the editing option
  closeThis() {
    this.isEditingStage = false;
    this.processService.$processToUpdate.next(null);
  }
}
