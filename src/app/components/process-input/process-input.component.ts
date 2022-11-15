import { Component, OnInit } from '@angular/core';
import * as Process from "process";
import {ProcessService} from "../../services/process.service";
import {Subject, takeUntil} from "rxjs";
import {ERROR} from "../../_enums/ERROR";
import {InlineFontsProcessor} from "@angular-devkit/build-angular/src/utils/index-file/inline-fonts";
import {IProcessNew} from "../../_interfaces/IProcess";

@Component({
  selector: 'app-process-input',
  templateUrl: './process-input.component.html',
  styleUrls: ['./process-input.component.css']
})
export class ProcessInputComponent implements OnInit {
  title: string = "";
  errorMessage: string | null = null;
  onDestroy = new Subject();

  processNew: IProcessNew = {
    title: ""
  }

  constructor(private processService: ProcessService) {
    this.processService.$processError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage)
  }

  ngOnInit(): void {
  }

  onCancel() {

  }

  onCreate() {
    if (this.title == ""){
      this.processService.$processError.next(ERROR.PROCESS_TITLE)
    } else {

        this.processNew = {
        title: this.title
      }
      this.processService.createProcess(this.processNew)
      this.processService.$processError.next(null)
    }
  }
  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
