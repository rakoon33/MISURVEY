import { Component, OnInit } from '@angular/core';
import { UserActivityLogService } from '../../core/services';
import { UserActivityLog } from '../../core/models';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';
import { filter } from 'rxjs';

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

  constructor(
    private userActivityLogService: UserActivityLogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
}
