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
  order: number = 0;


  stageEdit: IStage =
    {
      id: 0,
      question: "",
      order: 0,
      type: STAGETYPE.textbox
    }

  stageNew: IStageNew = {
    question: "",
    order: 0,
    type: STAGETYPE.textbox
  }
  process: IProcess | null = null;

  constructor(private modalService: NgbModal, private processService: ProcessService) {

    this.processService.$stageError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage = message);

    this.processService.$processToUpdate.pipe(first()).subscribe(process => {
      if (process != null) {
        this.process = process;
      }
    })
  }

  ngOnInit(): void {
  }

  //create a new stage
  onCreate() {
    console.log('creat clicked')
    if (this.question == ""){
      this.processService.$stageError.next(ERROR.STAGE_QUESTION_BLANK)
    } else if ((this.type == null) || (this.type == undefined)){
      this.processService.$stageError.next(ERROR.STAGE_TYPE_SELECT)
    } else {
      console.log(this.stageNew)
      // switch (this.type){
      //   case "option1":
      //     this.type = STAGETYPE.textbox
      //     break;
      //   case "option2":
      //     this.type = STAGETYPE.booleanTF
      //     break;
      //   case "option3":
      //     this.type = STAGETYPE.multipleRadio
      //     break;
      //   case "option4":
      //     this.type = STAGETYPE.multipleCheck
      // }
      this.stageNew.question = this.question;
      this.stageNew.order = this.order;
      this.stageNew.type = this.type;

      this.processService.createStage(this.stageNew);
      this.processService.$stageError.next(null)
      this.closeThis();
    }
  }



  onUpdate() {
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

  }


  //unsubscribing
  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  //for closing the modal
  closeThis() {
    this.modalService.dismissAll()
  }

}
