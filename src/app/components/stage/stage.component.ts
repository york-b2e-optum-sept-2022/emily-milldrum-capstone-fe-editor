import {Component, Input, OnInit} from '@angular/core';
import {IStage} from "../../_interfaces/IStage";
import {ProcessService} from "../../services/process.service";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {

  @Input()stage!: IStage;

  constructor(private processService: ProcessService) {

  }

  ngOnInit(): void {
  }

}
