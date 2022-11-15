import {Component, Input, OnInit} from '@angular/core';
import {IProcess} from "../../_interfaces/IProcess";
import {ProcessService} from "../../services/process.service";

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  @Input() process: IProcess = {
    id: 0,
    title: "",
    discontinued: false,
  };
  deleteAlert: string | null = null;
  constructor(private processService: ProcessService) { }

  ngOnInit(): void {
  }

  onCreate() {

  }

  onDelete() {
    this.deleteAlert = "Are you sure you wish to delete?\n" +
      "Deleting a process will remove all responses, if you wish to save responses update it to discontinued"
  }

  onDeleteConfirm() {
    this.processService.deleteProcess(this.process.id);
    this.deleteAlert = null;
  }
}
