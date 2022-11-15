import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StageInputComponent} from "../stage-input/stage-input.component";

@Component({
  selector: 'app-stage-list',
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {
  stageList: any = {number: 1, number2: 2, number3: 3};

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  //open stage input in modal
  openThis() {
    this.modalService.open(StageInputComponent);
  }
}
