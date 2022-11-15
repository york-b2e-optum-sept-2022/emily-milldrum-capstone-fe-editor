import {Component, Input, OnInit} from '@angular/core';
import {ProcessService} from "../../services/process.service";
import {first, Subject, takeUntil} from "rxjs";
import {ERROR} from "../../_enums/ERROR";
import {IProcess, IProcessNew} from "../../_interfaces/IProcess";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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

  processEdit: IProcess =
    {
      id: 0,
      title: "",
      discontinued: false,
      stages: [],
    }

  processNew: IProcessNew = {
    title: "",
    discontinued: false,
    stages: [],
  }


  constructor(private processService: ProcessService, private modalService: NgbModal) {
    this.modalService = modalService;

    this.processService.$processError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage)

    //get product to update
    this.processService.$processToUpdate.pipe(first()).subscribe(process => {
      if (process != null) {
        this.process = process;
      }
    })
  }

  ngOnInit(): void {
    if (this.process){
      this.title = this.process.title
      this.discontinued = this.process.discontinued;
    }
  }

  onCancel() {

  }

  //create a new process with default discontinued as false
  onCreate() {
    if (this.title == ""){
      this.processService.$processError.next(ERROR.PROCESS_TITLE)
    } else {
      this.processNew.title = this.title;
      this.processNew.discontinued = this.discontinued;
      this.processService.createProcess(this.processNew)
      this.processService.$processError.next(null)
      this.closeThis();
    }
  }


  onUpdate() {
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
      stages: this.process.stages,
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
    this.modalService.dismissAll()
  }

}
