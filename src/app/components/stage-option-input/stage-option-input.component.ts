import {Component, Input, OnInit} from '@angular/core';
import {IStage, IStageOptions} from "../../_interfaces/IStage";
import {ProcessService} from "../../services/process.service";
import {ERROR} from "../../_enums/ERROR";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-stage-option-input',
  templateUrl: './stage-option-input.component.html',
  styleUrls: ['./stage-option-input.component.css']
})
export class StageOptionInputComponent implements OnInit {

  @Input() option: IStageOptions = {id: 0, option: ""};
  @Input() type: string = "";
  isEditingOption: boolean = false;
  choiceEdit: string = "";

  errorMessage: string | null = null;
  onDestroy = new Subject();
  private stageToUpdate: IStage | null = null;

  constructor(private processService: ProcessService) {
    this.processService = processService;

    this.processService.$optionError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage = message);
    this.processService.$stageToUpdate.pipe(takeUntil(this.onDestroy)).subscribe(stage => this.stageToUpdate = stage);

  }

  ngOnInit(): void {
  }

  onDelete() {
    if(this.option.id){
      this.processService.deleteOption(this.option.id)
    }
  }

  //open editing panel
  onUpdate() {
    this.isEditingOption = true;
    this.choiceEdit = this.option.option;
  }

  //update the selected choice
  updateChoice() {
    if(this.choiceEdit == ""){
      this.processService.$optionError.next(ERROR.OPTION_VALUE_EMPTY)
    } else {
      this.option.option = this.choiceEdit
      this.processService.updateOption(this.option);
      this.isEditingOption = false;
    }
  }

  //cancel update
  cancelUpdate() {
    console.log(this.option)
    this.isEditingOption = false;
    this.choiceEdit = "";
  }

  //unsubscribing
  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
