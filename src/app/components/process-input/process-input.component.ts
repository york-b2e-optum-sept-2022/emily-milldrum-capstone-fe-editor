import {Component, Input, OnInit} from '@angular/core';
import {ProcessService} from "../../services/process.service";
import {Subject, takeUntil} from "rxjs";
import {ERROR} from "../../_enums/ERROR";
import {IProcess, IProcessNew} from "../../_interfaces/IProcess";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {IStage} from "../../_interfaces/IStage";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-process-input',
  templateUrl: './process-input.component.html',
  styleUrls: ['./process-input.component.css']
})
export class ProcessInputComponent implements OnInit {
  title: string = "";
  discontinued: boolean = false;
  errorMessage: string | null = null;
  @Input()process: IProcess | null = null;
  onDestroy = new Subject();
  stageListCreate: IStage[] | null = null;
  stageListExisting: IStage[] | null = null;

  stageReordering: boolean = false;

  public startPosition: number = 0
  public endPosition: number = 0

  processEdit: IProcess =
    {
      id: 0,
      title: "",
      discontinued: false,
      stage: [],
    }

  processNew: IProcessNew = {
    title: "",
    discontinued: false,
    stage: [],
  }


  constructor(private processService: ProcessService, private modalService: NgbModal) {
    this.modalService = modalService;

    this.processService.$processError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage = message)

    //get process to update
    this.processService.$processToUpdate.pipe(takeUntil(this.onDestroy)).subscribe(process => {
      if (process != null) {
        this.process = process;
      }
    })

    //get creating stagelist
    this.processService.$WIPstageList.pipe(takeUntil(this.onDestroy)).subscribe(sl => {
        this.stageListCreate = sl;
    })


    //get existing stagelist
    this.processService.$stageListExisting.pipe(takeUntil(this.onDestroy)).subscribe(sl => {
      this.stageListExisting = sl;
    })
  }

  ngOnInit(): void {

    this.processService.$processError.next(null)
    if (this.process){
      this.title = this.process.title
      this.discontinued = this.process.discontinued;
    }
  }

  //create a new process with default discontinued as false
  onCreateProcess() {
    if (this.title == "") {
      this.processService.$processError.next(ERROR.PROCESS_TITLE)
    }else {
      this.processNew.title = this.title;
      this.processNew.discontinued = this.discontinued;
      if (this.processService.createProcess(this.processNew))
      {
        this.closeThis();
      }
    }
  }


  onUpdateProcess() {
    if(this.process == null){
      this.processService.$processError.next(ERROR.PROCESS_NULL)
    } else if (this.title == ""){
      this.processService.$processError.next(ERROR.PROCESS_TITLE)
    }
    else
    {
    this.processEdit = {
      id: this.process.id,
      title: this.title,
      discontinued: this.discontinued,
      stage: this.process.stage,
    }

      this.processService.updateProcess(this.processEdit)
      this.closeThis();
    }

  }

  //unsubscribing
  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  //for closing the modal

  closeThis() {
    //this.modalService.dismissAll()
    this.processService.$isCreating.next(false)
    this.processService.$processToUpdate.next(null);
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

  saveOrder() {
    console.log('save order')
    console.log(this.process)
    if(this.process !== null)
    {
      this.processService.saveOrder(this.process)
    }
  }
  //
  // reorderStages() {
  //   this.stageReordering = true;
  // }
}
