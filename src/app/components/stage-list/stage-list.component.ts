import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {IStage, IStageOptions} from "../../_interfaces/IStage";
import {Subject, takeUntil} from "rxjs";
import {ProcessService} from "../../services/process.service";
import {ERROR} from "../../_enums/ERROR";

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {
  stageList: IStage[] = []

  @Input()stage: IStage | null = null;
  question: string = "";
  type: string = "";
  stageOrder: number = 0;
  isEditingStage: boolean = false;
  deleteAlert: string | null = null;
  stageOptions: IStageOptions[] = [];
  stageOptCount: number = 0;

  onDestroy = new Subject();
  errorMessage: string | null = null;

  constructor(private modalService: NgbModal, private processService: ProcessService) {

    this.processService.$stageError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage = message);
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

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  //edit button clicked
  onEdit() {
    this.processService.$stageToUpdate.next(this.stage);
    this.isEditingStage = true;
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



  //
  // drop(event: CdkDragDrop<string[]>) {
  //   this.startPosition = event.previousIndex
  //   this.endPosition = event.currentIndex
  //   if (this.survey != null) {
  //     if (event.previousIndex < event.currentIndex) {
  //       for (let i = 0; i < this.survey.stageSet.length; i++) {
  //         if (this.survey.stageSet[i].orderStage === event.previousIndex) {
  //           this.survey.stageSet[i].orderStage = event.currentIndex
  //           continue
  //         }
  //         if (this.survey.stageSet[i].orderStage >= this.startPosition && this.survey.stageSet[i].orderStage <= this.endPosition) {
  //           this.survey.stageSet[i].orderStage = this.survey.stageSet[i].orderStage - 1
  //         }
  //       }
  //     }
  //     if (event.previousIndex > event.currentIndex) {
  //       for (let i = 0; i < this.survey.stageSet.length; i++) {
  //         if (this.survey.stageSet[i].orderStage === event.previousIndex) {
  //           this.survey.stageSet[i].orderStage = event.currentIndex
  //           continue
  //         }
  //         if (this.survey.stageSet[i].orderStage <= this.startPosition && this.survey.stageSet[i].orderStage >= this.endPosition) {
  //           this.survey.stageSet[i].orderStage = this.survey.stageSet[i].orderStage + 1
  //         }
  //       }
  //     }
  //     moveItemInArray(this.survey.stageSet, event.previousIndex, event.currentIndex);
  //   }
  // }
}
