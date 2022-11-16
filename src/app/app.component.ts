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
  onDestroy = new Subject();


  constructor(private processService: ProcessService) {
    this.processService.$isCreating.pipe(takeUntil(this.onDestroy))
      .subscribe(isCreating => {
        this.isCreating = isCreating
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

