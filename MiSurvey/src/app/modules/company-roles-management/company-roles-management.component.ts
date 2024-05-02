import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Permission, CompanyRole } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Observable, Subscription, combineLatest, filter, map, take } from 'rxjs';
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

import {
  companyRoleManagementActions,
  moduleActions,
} from 'src/app/core/store/actions';

import { CompanyRolesManagementService } from '../../core/services';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-user-management',
  templateUrl: './company-roles-management.component.html',
  styleUrls: ['./company-roles-management.component.scss'],
})
export class CompanyRolesManagementComponent implements OnInit {
  roleForm: FormGroup;
  roleFormEdit: FormGroup;
  userPermissions$: Observable<Permission | undefined> | undefined;
  currentRoleId: number | undefined;
  roles$: Observable<CompanyRole[]> = this.store.select(
    companyRolesManagementSelectors.selectAllCompanyRoles
  );
  roleIdToDelete: number | undefined;

  modules$: Observable<{ ModuleID: number; name: string }[]>;
  roleFormView: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router,
    private companyRolesManagementService: CompanyRolesManagementService
  ) {
    this.roleForm = this.fb.group({
      roleData: this.fb.group({
        CompanyRoleName: ['', Validators.required],
        CompanyRoleDescription: [''],
      }),
      permissionsData: this.fb.array([]),
    });

    this.roleFormView = this.fb.group({
      roleData: this.fb.group({
        CompanyRoleName: [''],
        CompanyRoleDescription: [''],
      }),
      permissionsDataView: this.fb.array([]),
    });

    this.roleFormEdit = this.fb.group({
      roleData: this.fb.group({
        CompanyRoleName: ['', Validators.required],
        CompanyRoleDescription: [''],
      }),
      permissionsDataEdit: this.fb.array([]),
    });

    this.userPermissions$ = combineLatest([
      this.store.select(userSelector.selectCurrentUser),
      this.store.select(
        userSelector.selectPermissionByModuleName('Company Roles Management')
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
      map((modules) =>
        modules.map((module) => ({
          ModuleID: module.ModuleID,
          name: module.ModuleName,
        }))
      )
    );
  }

  get permissionsData(): FormArray {
    return this.roleForm.get('permissionsData') as FormArray;
  }

  get permissionsDataEdit(): FormArray {
    return this.roleFormEdit.get('permissionsDataEdit') as FormArray;
  }

  get permissionsDataView(): FormArray {
    return this.roleFormView.get('permissionsDataView') as FormArray;
  }

  ngOnInit() {
    this.store.dispatch(moduleActions.loadModulesRequest());
    this.store.dispatch(companyRoleManagementActions.loadCompanyRolesRequest());

    // Subscribe to modules$ to dynamically create form groups
    const subscription = this.modules$.subscribe((modules) => {
      this.permissionsData.clear(); // Clear existing form controls first
      modules.forEach((module) => {
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
    this.subscriptions.add(subscription);

    const subscription2 = this.modules$.subscribe((modules) => {
      this.permissionsDataView.clear();
      modules.forEach((module) => {
        const control = this.fb.group({
          ModuleID: module.ModuleID,
          CanView: false,
          CanAdd: false,
          CanUpdate: false,
          CanDelete: false,
          CanExport: false,
          CanViewData: false,
        });
        this.permissionsDataView.push(control);
      });
    });
    this.subscriptions.add(subscription2);
  }

  submitRole() {
    if (this.roleForm.valid) {
      const formData = this.roleForm.getRawValue();
      this.store.dispatch(
        companyRoleManagementActions.createCompanyRoleRequest(formData)
      );
    } else {
      this.toastr.error('Please fill all required fields.');
    }
  }

  openEditModal(roleId: number | undefined) {
    if (typeof roleId !== 'number') {
      this.toastr.error('Invalid role ID');
      return;
    }
    this.currentRoleId = roleId;

    this.companyRolesManagementService.getOneCompanyRole(roleId).subscribe({
      next: (response) => {
        if (response.status) {
          this.populateFormEdit(response.data);
          this.toggleModal(true, 'editRoleModal');
        } else {
          this.toastr.error(
            'Failed to fetch role details: ' + response.message
          );
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching role details');
        console.error(err);
      },
    });
  }

  populateFormEdit(data: any) {
    this.roleFormEdit.patchValue({
      roleData: {
        CompanyRoleName: data.CompanyRoleName,
        CompanyRoleDescription: data.CompanyRoleDescription,
      },
    });
    this.setPermissionsEdit(data.permissions);
  }

  setPermissionsEdit(permissions: any[]) {
    this.permissionsDataEdit.clear();
    const permissionsArray = this.permissionsDataEdit;
    permissionsArray.clear();
    permissions.forEach((permission) => {
      permissionsArray.push(
        this.fb.group({
          ModuleID: permission.ModuleID,
          CanView: permission.CanView,
          CanAdd: permission.CanAdd,
          CanUpdate: permission.CanUpdate,
          CanDelete: permission.CanDelete,
          CanExport: permission.CanExport,
          CanViewData: permission.CanViewData,
        })
      );
    });
  }

  submitEditRole() {
    if (this.roleFormEdit.valid) {
      if (typeof this.currentRoleId === 'number') {
        const formData = this.roleFormEdit.getRawValue();
        // Dispatch the update action with form data
        this.store.dispatch(
          companyRoleManagementActions.updateCompanyRoleRequest({
            roleId: this.currentRoleId,
            roleData: formData.roleData,
            permissionsData: formData.permissionsDataEdit,
          })
        );
        this.store.dispatch(
          companyRoleManagementActions.loadCompanyRolesRequest()
        );

        this.toggleModal(false, 'editRoleModal');
        // Modal close and toast are now managed by the effects and reducers
      } else {
        this.toastr.error('Role ID is undefined');
      }
    } else {
      this.toastr.error('Please fill all required fields.');
    }
  }

  viewRole(roleId: number | undefined) {
    if (typeof roleId !== 'number') {
      this.toastr.error('Invalid role ID');
      return;
    }

    this.companyRolesManagementService.getOneCompanyRole(roleId).subscribe({
      next: (response) => {
        if (response.status) {
          this.populateFormView(response.data);
          this.modalService.toggle({ show: true, id: 'viewRoleModal' });
        } else {
          this.toastr.error(
            'Failed to fetch role details: ' + response.message
          );
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching role details');
        console.error(err);
      },
    });
  }

  populateFormView(data: any) {
    this.roleFormView.patchValue({
      roleData: {
        CompanyRoleName: data.CompanyRoleName,
        CompanyRoleDescription: data.CompanyRoleDescription,
      },
    });
    this.setPermissionsView(data.permissions);
  }

  setPermissionsView(permissions: any[]) {
    this.permissionsDataView.clear();
    permissions.forEach((permission) => {
      this.permissionsDataView.push(
        this.fb.group({
          ModuleID: permission.ModuleID,
          CanView: permission.CanView,
          CanAdd: permission.CanAdd,
          CanUpdate: permission.CanUpdate,
          CanDelete: permission.CanDelete,
          CanExport: permission.CanExport,
          CanViewData: permission.CanViewData,
        })
      );
    });
  }

  get permissionsFormArray() {
    return this.roleForm.get('permissionsData') as FormArray;
  }

  private toggleModal(show: boolean, modalId: string): void {
    const action = { show: show, id: modalId };
    this.modalService.toggle(action);
  }

  deleteRole(roleId: number | undefined) {
    if (typeof roleId !== 'number') {
      this.toastr.error('Invalid role ID');
      return;
    }

    this.roleIdToDelete = roleId;
    this.modalService.toggle({ show: true, id: 'deleteRoleModal' });
  }

  confirmDeleteRole() {
    if (typeof this.roleIdToDelete === 'number') {
      // Dispatch the delete action
      this.store.dispatch(
        companyRoleManagementActions.deleteCompanyRoleRequest({
          roleId: this.roleIdToDelete,
        })
      );
      // Hide the modal
      this.modalService.toggle({ show: false, id: 'deleteRoleModal' });
      // Optionally refresh the roles list
      this.store.dispatch(
        companyRoleManagementActions.loadCompanyRolesRequest()
      );
    } else {
      this.toastr.error('Role ID is undefined');
    }
  }

  exportToPdf() {
    const rolesToExport = this.roles$; // Assuming this.roles$ contains the data

    // Fetch the observable data synchronously
    rolesToExport.pipe(take(1)).subscribe((roles) => {
      if (roles.length > 0) {
        const documentDefinition = this.getDocumentDefinition(roles);
        pdfMake.createPdf(documentDefinition).download('company-roles.pdf');
      } else {
        this.toastr.error('No roles data available to export.');
      }
    });
  }

  getDocumentDefinition(roles: CompanyRole[]) {
    const now = new Date();
    const formattedTime = now.toLocaleString();

    return {
      content: [
        {
          text: 'Company Roles Report',
          style: 'header',
        },
        this.buildRoleTable(roles),
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

  buildRoleTable(roles: CompanyRole[]) {
    return {
      table: {
        headerRows: 1,
        widths: [30, '*', '*', '*'],
        body: [
          [
            { text: '#', style: 'tableHeader' },
            { text: 'Role Name', style: 'tableHeader' },
            { text: 'Description', style: 'tableHeader' },
            { text: 'Created At', style: 'tableHeader' },
          ],
          ...roles.map((role, index) => [
            (index + 1).toString(),
            role.CompanyRoleName || '', 
            role.CompanyRoleDescription || '',
            role.CreatedAt ? new Date(role.CreatedAt).toLocaleDateString() : '', 
          ]),
        ],
      },
      layout: 'auto',
    };
  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }
}
