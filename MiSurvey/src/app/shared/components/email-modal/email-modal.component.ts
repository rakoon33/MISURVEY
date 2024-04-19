import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { SurveyManagementService } from 'src/app/core/services';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
})
export class EmailModalComponent implements OnInit {
  emailForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private surveyManagementService: SurveyManagementService
  ) {}

  ngOnInit() {
    this.emailForm = this.fb.group({
      emails: ['', [Validators.required, this.emailListValidator]],
    });
  }
  emailListValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Để tránh hiển thị lỗi khi trường input trống
    }

    const emails = control.value
      .split(',')
      .map((email: string) => email.trim().toLowerCase());

    // Kiểm tra email hợp lệ
    const invalidEmails = emails.filter(
      (email: string) => Validators.email(new FormControl(email)) !== null
    );
    if (invalidEmails.length > 0) {
      return { invalidEmailList: true };
    }

    // Kiểm tra email trùng lặp
    const uniqueEmails = new Set(emails);
    if (uniqueEmails.size !== emails.length) {
      return { duplicateEmails: true };
    }

    return null;
  }

  // Trong EmailModalComponent
  onSubmit() {
    if (this.emailForm.valid) {
      const emailData = this.emailForm.value.emails;
      const surveyID = this.data.surveyId;

      // Gọi service để gửi email
      this.surveyManagementService
        .sendSurveyEmail(surveyID, emailData)
        .subscribe({
          next: (response) => {
            // Đóng dialog với response để xử lý ở component cha
            this.dialogRef.close(response);
          },
          error: (error) => {
            // Đóng dialog với object lỗi để xử lý ở component cha
            this.dialogRef.close({
              status: false,
              message: 'An error occurred while sending emails',
              error,
            });
          },
        });
    }
  }
}
