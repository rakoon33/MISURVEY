import { Component, OnInit } from '@angular/core';
import { Company } from '../../models/company.model';
import { CompanyManagementService } from './company-management.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { IModalAction } from '@coreui/angular/lib/modal/modal.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.scss'],
  providers: [DatePipe],
})
export class CompanyManagementComponent implements OnInit {
  
  currentCompany: Company = {
    CompanyName: '',
    CompanyDomain: '',
    CreatedAt: new Date(),
    AdminID: 1,
  };
  companies: Company[] = [];
  isLoading = true;
  companyId: string = '';

  constructor(
    private datePipe: DatePipe,
    private companyManagementService: CompanyManagementService,
    private toastr: ToastrService, 
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    this.companyManagementService.getCompanies().subscribe({
      next: (data: Company[]) => {
        this.isLoading = false;
        this.companies = data;
        if (data.length === 0) {
          this.toastr.info('No company found.');
        }
        console.log(this.companies);
      },
      error: (error) => {
        this.isLoading = false; 
        if (error.status === 401) {
          this.toastr.error('Access denied. You do not have permission to view this content.');
        } else {
          this.toastr.error('Error fetching companies');
        }
      }
    });
  }

  editCompany(companyID: string): void {
    this.companyManagementService.getCompanyId(companyID).subscribe(company => {
      if (company) {
        this.currentCompany = {
          ...company, 
          CreatedAt: new Date(company.CreatedAt)
        };
        
        const action: IModalAction = {
          show: true,
          id: 'editCompanyModal'
        };
        this.modalService.toggle(action); 
      } else {
        this.toastr.error('Error fetching company with id ' + companyID);
      }
    });
  }
  
}