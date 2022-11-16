import {Component, Input, OnInit} from '@angular/core';
import {IStage} from "../../_interfaces/IStage";
import {IProcess, IProcessNew} from "../../_interfaces/IProcess";
import {first} from "rxjs";
import {ProcessService} from "../../services/process.service";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {

  @Input()stage!: IStage;
  @Input()stages2!: IStage;
  @Input()process!: IProcess;
  selectedProcess: IProcess | null = null;

  constructor(private processService: ProcessService) {

  }

  ngOnInit(): void {
  }

}
