import { Component, OnInit } from '@angular/core';
import { Company } from '../../models/company.model'
import { CompanyManagementService } from './company-management.service'
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { IModalAction } from '@coreui/angular/lib/modal/modal.service';

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
    private companyManagementService: CompanyManagementService,
    private toastr: ToastrService, 
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
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
        console.error('Error fetching companies', error);
      }
    });
  }

  getCompanies(): void {
    
  }
  
}