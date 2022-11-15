import { Component, OnInit } from '@angular/core';
import {IProcess} from "../../_interfaces/IProcess";
import {Subject, take, takeUntil} from "rxjs";
import {ProcessService} from "../../services/process.service";
import {ProcessInputComponent} from "../process-input/process-input.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.css']
})
export class ProcessListComponent implements OnInit {
  processList: IProcess[] = [];
  errorMessage: string | null = null;
  onDestroy = new Subject();

  constructor(private processService: ProcessService, private modalService: NgbModal) {
    this.processService.$processList.pipe(takeUntil(this.onDestroy)).subscribe(
      processList => {this.processList = processList
      console.log(processList)}
    )
    this.modalService = modalService;
    // this.processService.$processList.pipe(takeUntil(this.onDestroy)).subscribe(
    //   processList => this.processList = processList
    // );
    // console.log('process list on construct')
    // console.log(this.processList)
    //
    // this.processList = this.processService.$processList.getValue();
    // console.log(this.processList)
    //
    // // this.processList = this.processService.getProcessList();
    // console.log(this.processList)

  }

  ngOnInit(): void {
    // this.processService.$processList.pipe(takeUntil(this.onDestroy)).subscribe(
    //   processList => this.processList = processList
    // );
    // console.log('process list on init')
    // console.log(this.processList)
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }



  public open(modal: any): void {
    this.modalService.open(modal);
  }

  openThis() {
    const modalRef = this.modalService.open(ProcessInputComponent);
    // modalRef.componentInstance.name = 'World';
  }
}
