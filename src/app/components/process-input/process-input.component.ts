import {Component, Input, OnInit} from '@angular/core';
import {ProcessService} from "../../services/process.service";
import {Subject, takeUntil} from "rxjs";
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

  processNew: IProcessNew = {
    title: "",
    discontinued: false
  }

  constructor(private processService: ProcessService, private modalService: NgbModal) {
    this.modalService = modalService;

    this.processService.$processError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage)
  }

  ngOnInit(): void {
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
