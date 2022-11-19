import {Component, Input, OnInit} from '@angular/core';
import {IResponse} from "../../_interfaces/IResponse";

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements OnInit {

  @Input() response!: IResponse;
  constructor() { }

  ngOnInit(): void {
    console.log(this.response)

  }

}
