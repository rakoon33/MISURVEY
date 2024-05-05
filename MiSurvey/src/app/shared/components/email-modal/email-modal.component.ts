import { ToastrService } from 'ngx-toastr';
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
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.scss'],
})
export class EmailModalComponent implements OnInit {
  emailForm!: FormGroup;
  emailsSet: Set<string> = new Set(); // Set to accumulate emails

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private surveyManagementService: SurveyManagementService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.emailForm = this.fb.group({
      emails: ['', [Validators.required, this.emailListValidator]],
    });
  }

  emailListValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const emails = control.value
      .split(',')
      .map((email: string) => email.trim().toLowerCase());

    const invalidEmails = emails.filter(
      (email: string) => Validators.email(new FormControl(email)) !== null
    );
    if (invalidEmails.length > 0) {
      return { invalidEmailList: true };
    }

    const uniqueEmails = new Set(emails);
    if (uniqueEmails.size !== emails.length) {
      return { duplicateEmails: true };
    }

    return null;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const fileType = file.type;
  
        if (fileType === 'text/plain' || fileType === 'text/csv') {
          this.readTextFile(file);
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                   fileType === 'application/vnd.ms-excel') {
          this.readExcelFile(file);
        } else {
          console.error('Unsupported file format');
        }
      }
    }
  }

  readTextFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = reader.result as string;
      this.processTextContent(content);
    };
    reader.readAsText(file);
  }

  readExcelFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      this.processExcelFile(workbook);
    };
    reader.readAsArrayBuffer(file);
  }

  processTextContent(content: string) {
    const emails = content
      .split(/[\s,]+/)
      .map((email: string) => email.trim())
      .filter((email) => this.validateEmail(email));

    if (emails.length === 0) {
      this.toastr.error('No valid email addresses found in the imported file.');
    } else {
      emails.forEach((email) => this.emailsSet.add(email));
      this.updateEmailFormControl();
    }
  }

  processExcelFile(workbook: XLSX.WorkBook) {
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const sheetData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const emails: string[] = [];

    for (const row of sheetData) {
      if (Array.isArray(row) && row.length > 0) {
        const email = row[0]?.toString().trim();
        if (this.validateEmail(email)) {
          emails.push(email);
        }
      }
    }

    if (emails.length === 0) {
      this.toastr.error('No valid email addresses found in the imported file.');
    } else {
      emails.forEach((email) => this.emailsSet.add(email));
      this.updateEmailFormControl();
    }
  }

  updateEmailFormControl() {
    // Set the value of the email input to the concatenated emails
    this.emailForm.get('emails')?.setValue(Array.from(this.emailsSet).join(', '));
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  onSubmit() {
    if (this.emailForm.valid) {
      const emailData = this.emailForm.value.emails;
      const surveyID = this.data.surveyId;

      this.surveyManagementService
        .sendSurveyEmail(surveyID, emailData)
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
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
