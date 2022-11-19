import { Component } from '@angular/core';
import {ProcessService} from "./services/process.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'emily-milldrum-capstone-fe-editor';
  isCreating: boolean = false;
  viewResponses: boolean = false;
  onDestroy = new Subject();


  constructor(private processService: ProcessService) {
    this.processService.$isCreating.pipe(takeUntil(this.onDestroy))
      .subscribe(isCreating => {
        this.isCreating = isCreating
      })

    this.processService.$viewResponses.pipe(takeUntil(this.onDestroy))
      .subscribe(viewResponses => {
        this.viewResponses = viewResponses
      })
  }

  createNewProcess() {
    this.processService.$isCreating.next(true)
  }
  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}

