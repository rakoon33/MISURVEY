import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Permission, CompanyRole } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Observable, Subscription, combineLatest, filter, map } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import {
  Router,
  NavigationStart,
  Event as RouterEvent,
  ActivatedRoute,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';

import {
  userSelector,
  companyRolesManagementSelectors,
  moduleSelectors,
} from 'src/app/core/store/selectors';

import { companyRoleManagementActions, moduleActions } from 'src/app/core/store/actions';

@Component({
  selector: 'app-user-management',
  templateUrl: './company-roles-management.component.html',
  styleUrls: ['./company-roles-management.component.scss'],
})
export class CompanyRolesManagementComponent implements OnInit {

  roleForm: FormGroup;
  userPermissions$: Observable<Permission | undefined> | undefined;

  roles$: Observable<CompanyRole[]> = this.store.select(
    companyRolesManagementSelectors.selectAllCompanyRoles
  );

  modules$: Observable<{ ModuleID: number; name: string }[]>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      roleData: this.fb.group({
        CompanyRoleName: ['', Validators.required],
        CompanyRoleDescription: [''],
      }),
      permissionsData: this.fb.array([]),
    });

    this.userPermissions$ = combineLatest([
      this.store.select(userSelector.selectCurrentUser),
      this.store.select(
        userSelector.selectPermissionByModuleName('User Management')
      ),
    ]).pipe(
      map(([currentUser, permissions]) => {
        // If the current user is a Supervisor, return their actual permissions
        if (currentUser?.UserRole === 'Supervisor') {
          return permissions;
        }
        // If not, return an object with all permissions set to true
        return {
          CanView: true,
          CanAdd: true,
          CanUpdate: true,
          CanDelete: true,
          CanExport: true,
          CanViewData: true,
        } as Permission;
      })
    );

    this.modules$ = this.store.select(moduleSelectors.selectAllModules).pipe(
      map(modules => modules.map(module => ({
        ModuleID: module.ModuleID,
        name: module.ModuleName
      })))
    );

      console.log(this.store.select(moduleSelectors.selectAllModules))
  }

  get permissionsData(): FormArray {
    return this.roleForm.get('permissionsData') as FormArray;
  }

  ngOnInit() {
    this.store.dispatch(moduleActions.loadModulesRequest());
    this.store.dispatch(companyRoleManagementActions.loadCompanyRolesRequest());

    // Subscribe to modules$ to dynamically create form groups
    this.modules$.subscribe(modules => {
      modules.forEach(module => {
        const control = this.fb.group({
          ModuleID: module.ModuleID,
          CanView: false,
          CanAdd: false,
          CanUpdate: false,
          CanDelete: false,
          CanExport: false,
          CanViewData: false,
        });
        this.permissionsData.push(control);
      });
    });
  }

  submitRole() {
    if (this.roleForm.valid) {
      const formData = this.roleForm.getRawValue();
      console.log(formData);
      this.store.dispatch(
        companyRoleManagementActions.createCompanyRoleRequest(formData)
      );
    } else {
      this.toastr.error('Please fill all required fields.');
    }
  }

  editRole(arg0: any) {
    throw new Error('Method not implemented.');
  }
  viewRole(arg0: any) {
    throw new Error('Method not implemented.');
  }

  get permissionsFormArray() {
    return this.roleForm.get('permissionsData') as FormArray;
  }
}
