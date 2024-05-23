import { Component, OnInit } from '@angular/core';
import { UserActivityLogService } from '../../core/services';
import { Permission, UserActivityLog } from '../../core/models';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';
import { Observable, combineLatest, filter, map, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { userSelector } from 'src/app/core/store/selectors';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-user-activity-log',
  templateUrl: './user-activity-log.component.html',
  styleUrls: ['./user-activity-log.component.scss'],
})
export class UserActivityLogComponent implements OnInit {
  activities: UserActivityLog[] = [];
  isLoading: boolean = true;

  userPermissions$: Observable<Permission | undefined> | undefined;

  // search
  filteredActivities$: Observable<UserActivityLog[]> | undefined;
  currentPage = 1;
  itemsPerPage = 10;
  totalActivities = 0;
  pages: number[] = [];
  searchText: string = '';
  filterType: string = 'userID'; 

  constructor(
    private userActivityLogService: UserActivityLogService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private toastr: ToastrService
  ) {
    this.userPermissions$ = combineLatest([
      this.store.select(userSelector.selectCurrentUser),
      this.store.select(
        userSelector.selectPermissionByModuleName('User Activity Log')
      ),
    ]).pipe(
      map(([currentUser, permissions]) => {
        if (currentUser?.UserRole === 'Supervisor') {
          return permissions;
        }
        return {
          CanViewData: true,
          CanView: true,
          CanAdd: true,
          CanUpdate: true,
          CanDelete: true,
          CanExport: true,
        } as Permission;
      })
    );
  }

  ngOnInit(): void {
    this.loadActivities();
  }

  applyFilters(): void {
    this.filteredActivities$ = of(this.activities).pipe(
      map(activities => activities.filter(activity => this.filterActivity(activity))),
      tap(filteredActivities => {
        this.totalActivities = filteredActivities.length;
        this.updatePagination();
      }),
      map(filteredActivities => {
        // Calculate the starting index based on the current page and the number of items per page
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        // Return only the slice of data that should be visible on the current page
        return filteredActivities.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }
  
  
  filterActivity(activity: UserActivityLog): boolean {
    const searchTextLower = this.searchText.toLowerCase();
    switch (this.filterType) {
      case 'userID':
        return activity.UserID.toString().includes(this.searchText);
      case 'action':
        return activity.UserAction.toLowerCase().includes(searchTextLower);
      case 'description':
        return activity.ActivityDescription.toLowerCase().includes(searchTextLower);
      default:
        return true;
    }
  }

  updatePagination() {
    const pageCount = Math.ceil(this.totalActivities / this.itemsPerPage);
    this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.pages.length) return;
    this.currentPage = page;
    this.applyFilters();
  }

  refreshData() {
    this.searchText = '';
    this.filterType = 'userID';
    this.currentPage = 1;
    this.applyFilters();
  }

  
  setFilterType(type: string): void {
    this.filterType = type;
    this.applyFilters(); // Reapply filters whenever the filter type changes
  }

  loadActivities(): void {
    this.userActivityLogService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data.activities;
        this.isLoading = false;
        this.applyFilters();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  exportToPdf() {
    const activitiesToExport = this.activities; // Assuming this.activities contains the data

    if (activitiesToExport.length > 0) {
      const documentDefinition = this.getDocumentDefinition(activitiesToExport);
      pdfMake.createPdf(documentDefinition).download('user-activity-log.pdf');
    } else {
      this.toastr.error('No activities data available to export.');
    }
  }

  getDocumentDefinition(activities: UserActivityLog[]) {
    const now = new Date();
    const formattedTime = now.toLocaleString();

    return {
      content: [
        {
          text: 'User Activity Log Report',
          style: 'header',
        },
        this.buildActivityTable(activities),
        {
          text: `Report generated on: ${formattedTime}`,
          style: 'subheader',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10] as [number, number, number, number],
        },
        subheader: {
          fontSize: 10,
          bold: true,
          margin: [0, 10, 0, 10] as [number, number, number, number],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
        },
      },
    };
  }

  buildActivityTable(activities: UserActivityLog[]) {
    return {
      table: {
        headerRows: 1,
        widths: [30, 'auto', 'auto', '*', 'auto', '*', '*'],
        body: [
          [
            { text: '#', style: 'tableHeader' },
            { text: 'User ID', style: 'tableHeader' },
            { text: 'Action', style: 'tableHeader' },
            { text: 'Description', style: 'tableHeader' },
            { text: 'Table Name', style: 'tableHeader' },
            { text: 'Created At', style: 'tableHeader' },
            { text: 'Company ID', style: 'tableHeader' },
          ],
          ...activities.map((activity, index) => [
            (index + 1).toString(),
            activity.UserID,
            activity.UserAction,
            activity.ActivityDescription,
            activity.TableName,
            new Date(activity.CreatedAt).toLocaleDateString(),
            activity.CompanyID != null ? activity.CompanyID : 'SuperAdmin',
          ]),
        ],
      },
      layout: 'auto',
    };
  }
}
