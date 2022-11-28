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
  choiceFormat: IStageOptions = {option: ""}

  errorMessage: string | null = null;
  onDestroy = new Subject();
  stageToUpdate: IStage | null = null;
  private stageOptions: IStageOptions[] | null = null;

  constructor(private processService: ProcessService) {
    this.processService = processService;

    this.processService.$optionError.pipe(takeUntil(this.onDestroy)).subscribe(message => this.errorMessage = message);
    this.processService.$stageToUpdate.pipe(takeUntil(this.onDestroy)).subscribe(stage => this.stageToUpdate = stage);
   this.processService.$stageOptList.pipe(takeUntil(this.onDestroy)).subscribe(stageOptions => this.stageOptions = stageOptions);

  }

  ngOnInit(): void {

  }

  //delete an option
  onDelete() {
    if(this.option.id){
      this.processService.deleteOption(this.option.id)
    } else {
      this.processService.deleteOptionNS(this.option)
    }
  }

  //open editing panel
  onUpdate() {
    this.isEditingOption = true;
    this.processService.stageOption = this.option;
    this.choiceEdit = this.option.option;
  }

  //update the selected choice
  updateChoice() {
    if(this.stageToUpdate){
      this.processService.$stageOptList.next(this.stageToUpdate.stageOptions)
    }
    if(this.choiceEdit == ""){
      this.processService.$optionError.next(ERROR.OPTION_VALUE_EMPTY)
    } else {
      console.log(this.option.id)
        if(this.option.id){ //if this stage option exists in db
          this.option.option = this.choiceEdit
          this.processService.updateOption(this.option);
          this.isEditingOption = false;
        } else { //if stage does not exist in db
          console.log("this stage opt does not exist in db yet")
          if(this.stageToUpdate !== null) {//if stage to update add to db
            console.log('stage exists, add new to existing stage')
            this.choiceFormat.option = this.choiceEdit
            this.choiceFormat.stageId = this.stageToUpdate.id;
            this.processService.addOption(this.choiceFormat)
            this.isEditingOption = false;
          } else {//if stage new, store in ps on new array until stage saved.
            console.log('new stage store in ps until stage save')
            this.choiceFormat.option = this.choiceEdit
            this.processService.addOptionNS(this.choiceFormat)
            this.isEditingOption = false;
          }


        }
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
