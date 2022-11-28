import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProcessInputComponent } from './components/process-input/process-input.component';
import { ProcessListComponent } from './components/process-list/process-list.component';
import { ProcessComponent } from './components/process/process.component';
import { StageComponent } from './components/stage/stage.component';
import { StageInputComponent } from './components/stage-input/stage-input.component';
import { StageListComponent } from './components/stage-list/stage-list.component';
import { ResponseComponent } from './components/response/response.component';
import { ResponseListComponent } from './components/response-list/response-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { StageOptionInputComponent } from './components/stage-option-input/stage-option-input.component';
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    AppComponent,
    ProcessInputComponent,
    ProcessListComponent,
    ProcessComponent,
    StageComponent,
    StageInputComponent,
    StageListComponent,
    ResponseComponent,
    ResponseListComponent,
    NavbarComponent,
    StageOptionInputComponent,
  ],
    imports: [
        BrowserModule,
        NgbModule,
        FormsModule,
        HttpClientModule,
      DragDropModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
