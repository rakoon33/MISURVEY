import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { surveyManagementActions } from 'src/app/core/store/actions';
import { userSelector } from 'src/app/core/store/selectors';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-survey-option',
  templateUrl: './survey-option.component.html',
  styleUrls: ['./survey-option.component.scss']
})
export class SurveyOptionComponent implements OnInit {
  availableMethods: string[] = [];

  constructor(
    private store: Store,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.store.select(userSelector.selectCurrentUserPackages).pipe(
      map(userPackage => userPackage!.servicePackage?.ShareMethod || '')
    ).subscribe(shareMethods => {
      this.availableMethods = shareMethods.split(',').map(method => method.trim());
    });
  }

  selectMethod(method: string) {
    if (this.availableMethods.includes(method)) {
      this.store.dispatch(surveyManagementActions.setInvitationMethod({ method }));
      this.router.navigate(['/survey-management/survey']);
    } else {
      this.toastr.error(`Your package does not allow the "${method}" method.`);
    }
  }
}
