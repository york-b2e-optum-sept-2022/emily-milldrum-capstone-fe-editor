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
  //private stageToUpdate: IStage | null = null;
  //private stageOptions: IStageOptions[] | null = null;
  //  choiceInput: any;

  constructor(private processService: ProcessService) {
    this.processService = processService;

    this.processService.$optionError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage = message);
    //this.processService.$stageToUpdate.pipe(takeUntil(this.onDestroy)).subscribe(stage => this.stageToUpdate = stage);
    // this.processService.$stageOptList.pipe(takeUntil(this.onDestroy)).subscribe(stageOptions => this.stageOptions = stageOptions);

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

  // //add a response choice
  // addChoice() {
  //   //TODO fix the choice input to choice: ??
  //   if (this.choiceInput == ("" || null)){
  //     this.processService.$stageError.next(ERROR.STAGE_FIELD_BLANK)
  //   } else {
  //     //this.creatingOptions.option = (...this.choiceInput);
  //     //this.stageOptions.push(this.creatingOptions);
  //     this.processService.$stageError.next(null)
  //     console.log(this.choiceInput)
  //     //console.log(this.stageOptions)
  //     this.choiceInput = "";
  //   }

  //}
}
