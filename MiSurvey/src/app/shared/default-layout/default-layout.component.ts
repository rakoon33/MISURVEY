import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { navItems as originalNavItems } from './_nav';
import { userSelector } from 'src/app/core/store/selectors';
import { Router } from '@angular/router';
import { NotificationsSidebarComponent } from '../components/notifications-sidebar/notifications-sidebar.component';
import { ModalService } from '@coreui/angular';
import { SurveyManagementService } from 'src/app/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: any[] | undefined;
  userRole = '';
  unreadCount = 0;

  selectedSurveySummary: any[] = [];
  selectedSurveyQuestion: any = {};
  currentQuestionIndex: number = 0;
  highlightedResponseId: number | null = null;

  @ViewChild(NotificationsSidebarComponent, { static: false })
  private notificationsSidebar!: NotificationsSidebarComponent;

  constructor(
    private store: Store,
    private router: Router,
    private surveyManagementService: SurveyManagementService,
    private modalService: ModalService
  ) {}

  toggleNotificationsSidebar(): void {
    if (this.notificationsSidebar) {
      this.notificationsSidebar.toggleVisibility();
    }
  }

  ngOnInit(): void {
    this.store.select(userSelector.selectCurrentUser).subscribe((user) => {
      if (user) {
        this.userRole = user.UserRole;
      }
      if (user && user.UserRole === 'Supervisor') {
        this.store
          .select(userSelector.selectCurrentUserPermissions)
          .subscribe((permissions) => {
            this.navItems = originalNavItems.filter((item) => {
              const permission = permissions?.find(
                (perm) => perm.module.ModuleName === item.name
              );
              return permission ? permission.CanView : false;
            });

            const dashboardPermission = permissions?.find(
              (perm) => perm.module.ModuleName === 'Dashboard'
            );
            if (!dashboardPermission?.CanView) {
              const firstNavItemPath = this.navItems[0]?.url || '/';
              this.router.navigate([firstNavItemPath]);
            }
          });
      } else {
        if (user && user.UserRole === 'SuperAdmin') {
          this.navItems = originalNavItems.filter(
            (item) =>
              item.name !== 'Survey Management' &&
              item.name !== 'Role Management' &&
              item.name !== 'Customer Management' &&
              item.name !== 'Subscription Plans' &&
              item.name !== 'Report Management'
          );
        } else {
          this.navItems = originalNavItems.filter(
            (item) => item.name !== 'Question Management'
          );
        }
      }
    });
  }

  handleNotificationClick(responseID: number): void {
    this.surveyManagementService.getSurveyDetailsByResponseId(responseID).subscribe({
      next: (data) => {
        if (data.status) {
          this.openModal(data.surveyId, data.questionIndex, responseID);
        }
      },
      error: (error) => console.error('Error fetching survey details:', error)
    });
  }

  openModal(surveyId: number, questionIndex: number, responseId: number): void {
    this.surveyManagementService.getSurveySummaryById(surveyId).subscribe({
      next: (response) => {
        if (response && response.status) {
          this.selectedSurveySummary = response.summary;
          this.currentQuestionIndex = questionIndex;
          this.highlightedResponseId = responseId;

          // Find the specific response and move it to the top of the list
          const currentQuestion = this.selectedSurveySummary[this.currentQuestionIndex];
          const responseIndex = currentQuestion.responses.findIndex((resp: any) => resp.responseID === responseId);
          
          if (responseIndex !== -1) {
            const [specificResponse] = currentQuestion.responses.splice(responseIndex, 1);
            currentQuestion.responses.unshift(specificResponse);
          }
          
          
          this.showCurrentQuestion();
          setTimeout(() => {
            this.highlightedResponseId = null;
          }, 4000);
        }
      },
      error: (error) => console.error('Error fetching survey summary:', error),
    });
  }

 

  showCurrentQuestion() {
    this.selectedSurveyQuestion =
      this.selectedSurveySummary[this.currentQuestionIndex];
    this.toggleModal('seeResponsesModal', true);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.selectedSurveySummary.length - 1) {
      this.currentQuestionIndex++;
      this.showCurrentQuestion();
    } else {
      this.toggleModal('seeResponsesModal', false);
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showCurrentQuestion();
    }
  }

  toggleModal(modalId: string, show: boolean) {
    this.modalService.toggle({ id: modalId, show: show });
  }


    
  isValidEmail(email: string | undefined): boolean {
    if (!email) {
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
