import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StageInputComponent} from "../stage-input/stage-input.component";
import {IStage} from "../../_interfaces/IStage";
import {IProcess} from "../../_interfaces/IProcess";

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {
  stageList: IStage[] =[]
  //TODO
  @Input() process!: IProcess;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log('init this process')
    console.log(this.process)
  }
}
