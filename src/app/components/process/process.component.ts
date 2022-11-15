import {Component, Input, OnInit} from '@angular/core';
import {IProcess} from "../../_interfaces/IProcess";

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  @Input() process: IProcess = {
    id: 0,
    title: ""
  };
  constructor() { }

  ngOnInit(): void {
  }

}
