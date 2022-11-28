import {Component, Input, OnInit} from '@angular/core';
import {IProcess} from "../../_interfaces/IProcess";
import {ProcessService} from "../../services/process.service";
import {IStage} from "../../_interfaces/IStage";
import {Subject, takeUntil} from "rxjs";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  @Input() process: IProcess = {
    id: 0,
    title: "",
    discontinued: false,
    stage: [],
  };

  stageList: IStage[] =[];

  onDestroy = new Subject();
  public startPosition: number = 0
  public endPosition: number = 0

  deleteAlert: string | null = null;
  constructor(private processService: ProcessService,) {
    this.processService.$stageList.pipe(takeUntil(this.onDestroy)).subscribe(
      stageList => this.stageList = stageList
    );
  }

  ngOnInit(): void {

  }

  //confirm delete
  onDelete() {
    this.deleteAlert = "Are you sure you wish to delete?\n" +
      "Deleting a process will remove all responses, if you wish to save responses update it to discontinued"
  }

  //execute delete after confirm
  onDeleteConfirm() {
    this.processService.deleteProcess(this.process.id);
    this.deleteAlert = null;
  }

  //update existing process
  onUpdate() {
    this.processService.$processToUpdate.next(this.process);
    this.processService.$isCreating.next(true)

  }

  drop(event: CdkDragDrop<string[]>) {
    this.startPosition = event.previousIndex
    this.endPosition = event.currentIndex
    if (this.process != null) {
      if (event.previousIndex < event.currentIndex) {
        for (let i = 0; i < this.process.stage.length; i++) {
          if (this.process.stage[i].stageOrder === event.previousIndex) {
            this.process.stage[i].stageOrder = event.currentIndex
            continue
          }
          if (this.process.stage[i].stageOrder >= this.startPosition && this.process.stage[i].stageOrder <= this.endPosition) {
            this.process.stage[i].stageOrder = this.process.stage[i].stageOrder - 1
          }
        }
      }
      if (event.previousIndex > event.currentIndex) {
        for (let i = 0; i < this.process.stage.length; i++) {
          if (this.process.stage[i].stageOrder === event.previousIndex) {
            this.process.stage[i].stageOrder = event.currentIndex
            continue
          }
          if (this.process.stage[i].stageOrder <= this.startPosition && this.process.stage[i].stageOrder >= this.endPosition) {
            this.process.stage[i].stageOrder = this.process.stage[i].stageOrder + 1
          }
        }
      }
      moveItemInArray(this.process.stage, event.previousIndex, event.currentIndex);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  viewResponses() {
    this.processService.$processToUpdate.next(this.process)
    this.processService.$viewResponses.next(true)
  }
}
