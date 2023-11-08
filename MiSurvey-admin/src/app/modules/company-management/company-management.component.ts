import { Component, OnInit } from '@angular/core';
import { Company } from '../../models/company.model'
import { CompanyManagementService } from './company-management.service'

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.scss']
})
export class CompanyManagementComponent implements OnInit {
  
  companies: Company[] = [];
  isLoading = true;
  companyId: string = '';

  constructor(
    private companyService: CompanyManagementService
  ) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (data) => {  this.companies = data; },
      error: (error) => { console.error('Error fetching companies', error); },
      complete: () => {  console.log('Retrieval of companies completed'); }
    });
  }
}