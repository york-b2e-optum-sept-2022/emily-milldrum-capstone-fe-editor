import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StageInputComponent} from "../stage-input/stage-input.component";
import {IStage} from "../../_interfaces/IStage";
import {IProcess} from "../../_interfaces/IProcess";
import {Subject, takeUntil} from "rxjs";
import {ProcessService} from "../../services/process.service";

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {
  stageList: IStage[] =[]
  @Input() process!: IProcess;
  onDestroy = new Subject();

  constructor(private modalService: NgbModal, private processService: ProcessService) {
    this.processService.$stageList.pipe(takeUntil(this.onDestroy)).subscribe(
      stageList => {this.stageList = stageList
      }
    )
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
