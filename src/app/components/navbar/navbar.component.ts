import { Component, OnInit } from '@angular/core';
import {ProcessService} from "../../services/process.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private processService: ProcessService) {
    this.processService = processService
  }

  ngOnInit(): void {
  }

  home() {
    this.processService.$isCreating.next(false)
    this.processService.$viewResponses.next(false)
  }

  createNav() {
    this.processService.$isCreating.next(true)
    this.processService.$viewResponses.next(false)
  }
}
