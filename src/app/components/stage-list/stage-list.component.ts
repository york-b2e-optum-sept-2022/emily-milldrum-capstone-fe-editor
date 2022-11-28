import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StageInputComponent} from "../stage-input/stage-input.component";
import {IStage} from "../../_interfaces/IStage";
import {IProcess} from "../../_interfaces/IProcess";
import {Subject, takeUntil} from "rxjs";
import {ProcessService} from "../../services/process.service";

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {
  stageList: IStage[] =[]
  @Input() process!: IProcess;
  onDestroy = new Subject();

  constructor(private modalService: NgbModal, private processService: ProcessService) {
    this.processService.$stageList.pipe(takeUntil(this.onDestroy)).subscribe(
      stageList => {this.stageList = stageList
      }
    )
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
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
