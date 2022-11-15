import {Component, Input, OnInit} from '@angular/core';
import {IProcess, IProcessNew} from "../../_interfaces/IProcess";
import {Subject} from "rxjs";
import {IStage, IStageNew} from "../../_interfaces/IStage";
import {STAGETYPE} from "../../_enums/STAGETYPE";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-stage-input',
  templateUrl: './stage-input.component.html',
  styleUrls: ['./stage-input.component.css']
})
export class StageInputComponent implements OnInit {

  errorMessage: string | null = null;
  @Input()stage: IStage | null = null;
  onDestroy = new Subject();
  question: string = "";
  type: any; //TODO change any


  stageEdit: IStage =
    {
      id: 0,
      question: "",
      order: 0,
      type: STAGETYPE.textbox
    }

  stageNew: IStageNew = {
    question: "",
    order: 0,
    type: STAGETYPE.textbox
  }
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onCreate() {

  }

  onUpdate() {

  }

  //unsubscribing
  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  //for closing the modal
  closeThis() {
    this.modalService.dismissAll()
  }

}
