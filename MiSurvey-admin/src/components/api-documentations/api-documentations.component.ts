import { Component, OnInit, ElementRef } from '@angular/core';
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'app-api-documentations',
  templateUrl: './api-documentations.component.html',
  styleUrls: ['./api-documentations.component.scss']
})
export class ApiDocumentationsComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    SwaggerUI({
      url: 'http://localhost:3000/api-docs.json',
      // Make sure this URL points to your Swagger JSON
      domNode: this.el.nativeElement.querySelector('#swagger-container'),
      deepLinking: true
    });
  }
}

  
