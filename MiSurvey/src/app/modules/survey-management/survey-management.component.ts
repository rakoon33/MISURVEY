import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-survey-management',
  templateUrl: './survey-management.component.html',
  styleUrls: ['./survey-management.component.scss'],
  providers: [DatePipe],
})
export class SurveyManagementComponent implements OnInit {

  constructor(
  ) {}

  ngOnInit(): void {
  }

}