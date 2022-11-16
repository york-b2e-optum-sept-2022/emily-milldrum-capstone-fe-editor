import {Component, Input, OnInit} from '@angular/core';
import {IStage} from "../../_interfaces/IStage";
import {IProcess} from "../../_interfaces/IProcess";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {

  @Input()stage!: IStage;
  @Input()process!: IProcess;
  constructor() { }

  ngOnInit(): void {
  }

}
