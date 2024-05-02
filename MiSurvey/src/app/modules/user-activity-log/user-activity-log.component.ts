import { Component, OnInit } from '@angular/core';
import { UserActivityLogService } from '../../core/services';
import { Permission, UserActivityLog } from '../../core/models';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';
import { Observable, combineLatest, filter, map } from 'rxjs';
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
  totalActivities: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  userPermissions$: Observable<Permission | undefined> | undefined;
  
  constructor(
    private userActivityLogService: UserActivityLogService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private toastr: ToastrService,
  ) {

    this.userPermissions$ = combineLatest([
      this.store.select(userSelector.selectCurrentUser),
      this.store.select(userSelector.selectPermissionByModuleName('User Activity Log'))
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
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: RouterEvent) => {
        if (event instanceof NavigationStart) {
          if (event.url === '/user-activity') {
            this.router.navigate(['/user-activity'], {
              queryParams: { page: 1, pageSize: 10 },
              replaceUrl: true, // This replaces the current state in history
            });
          }
        }
      });
      
    this.route.queryParams.subscribe((params) => {
      this.currentPage = parseInt(params['page'], 10) || 1;
      this.pageSize = parseInt(params['pageSize'], 10) || 10;
      this.loadActivities();
    });
  }

  loadActivities(): void {
    this.userActivityLogService
      .getAllActivities(this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.activities = data.activities;
          this.totalPages = Math.ceil(data.total / this.pageSize);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onPageChange(page: number | string) {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    this.router.navigate(['/user-activity'], {
      queryParams: { page: pageNumber, pageSize: this.pageSize },
    });
    this.currentPage = pageNumber;
    this.loadActivities();
  }

  onPageChangeNext() {
    this.router.navigate(['/user-activity'], {
      queryParams: {
        page: Number(this.currentPage) + 1,
        pageSize: this.pageSize,
      },
    });
    this.loadActivities();
  }

  onPageChangePrevious() {
    this.router.navigate(['/user-activity'], {
      queryParams: {
        page: Number(this.currentPage) - 1,
        pageSize: this.pageSize,
      },
    });
    this.loadActivities();
  }

  getPaginationRange(
    currentPageStr: string,
    totalPages: number,
    siblingCount = 1
  ): Array<number | string> {
    const currentPage = parseInt(currentPageStr, 10);
    const range = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    range.push(1);

    if (shouldShowLeftDots) {
      range.push('...');
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        range.push(i);
      }
    }

    if (shouldShowRightDots) {
      range.push('...');
    }

    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
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
