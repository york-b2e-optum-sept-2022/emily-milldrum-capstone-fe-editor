import { Component, OnInit } from '@angular/core';
import {IProcess} from "../../_interfaces/IProcess";
import {ProcessService} from "../../services/process.service";
import {first, Subject, takeUntil} from "rxjs";
import {IResponse} from "../../_interfaces/IResponse";

@Component({
  selector: 'app-response-list',
  templateUrl: './response-list.component.html',
  styleUrls: ['./response-list.component.css']
})
export class ResponseListComponent implements OnInit {

  selectedProcess: IProcess | null = null;
  responseList: IResponse[] | null = null;
  onDestroy = new Subject();
  responseCount: number = 0;

  constructor(private processService: ProcessService) {
    this.processService = processService;

    //get product to update
    this.processService.$processToUpdate.pipe(first()).subscribe(process => {
      if (process != null) {
        this.selectedProcess = process;
        this.processService.getResponseList(this.selectedProcess)
      }
    })

  }

  ngOnInit(): void {
    this.processService.$responseList.pipe(takeUntil(this.onDestroy)).subscribe(list => {
      this.responseList = list;
      console.log(this.responseList)
      this.responseCount = this.responseList.length;
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
