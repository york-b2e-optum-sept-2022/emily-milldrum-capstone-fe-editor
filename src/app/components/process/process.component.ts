import {Component, Input, OnInit} from '@angular/core';
import {IProcess} from "../../_interfaces/IProcess";
import {ProcessService} from "../../services/process.service";
import {IStage} from "../../_interfaces/IStage";
import {Subject, takeUntil} from "rxjs";

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

  deleteAlert: string | null = null;
  constructor(private processService: ProcessService,) {
  }

  ngOnInit(): void {
    this.processService.$stageList.pipe(takeUntil(this.onDestroy)).subscribe(
      stageList => this.stageList = stageList
    );
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
    //this.modalService.open(ProcessInputComponent);
  }

  // public open(modal: any): void {
  //   this.modalService.open(modal);
  // }

  // //open stage input in modal
  // openThis() {
  //   this.processService.$processToUpdate.next(this.process)
  //   this.modalService.open(StageInputComponent);
  // }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  viewResponses() {
    this.processService.$processToUpdate.next(this.process)
    this.processService.$viewResponses.next(true)
  }
}
