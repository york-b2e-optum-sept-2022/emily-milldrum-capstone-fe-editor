import {Component, Input, OnInit} from '@angular/core';
import {IStage} from "../../_interfaces/IStage";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {

  @Input()stage!: IStage;
  constructor() { }

  ngOnInit(): void {
  }

}
