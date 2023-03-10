import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
})
export class AccountSettingsComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  account!: Student;
  loading: boolean = false;
  constructor(
    private http: HttpClient,
    private toast: NgToastService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.getAccount();
  }
  /* Form Fields Getters */
  get name() {
    return this.form.get('name');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  /* Form Fields Getters */
  ngOnInit(): void {}

  getAccount() {
    const token = localStorage.getItem('token') || '';
    const account: any = jwt_decode(token);
    this.http
      .get(API_URL + `/api/students/getStudent/${account.email}`)
      .subscribe((res: any) => {
        this.account = res;

        this.name?.setValue(this.account.name);
        this.email?.setValue(this.account.email);
        this.email?.disable();
        this.password?.setValue(this.account.password.slice(0, 16));
      });
  }

  deleteStudent() {
    this.http
      .post(API_URL + `/api/students/deleteStudent`, {
        email: this.account.email,
      })
      .subscribe({
        next: (data: any) => {
          this.toast.success({ detail: data.message });
          localStorage.removeItem('token');
          this.router.navigateByUrl('/signin');
        },
        error: (data: any) => {
          this.toast.error({ detail: data.message });
        },
      });
  }

  updateAccount() {
    if (this.form.status === 'INVALID') {
      this.toast.error({ detail: 'Enter valid data!' });
      return;
    }
    let validatedPassword;
    if (this.password?.value === this.account.password) {
      validatedPassword = '';
    } else {
      validatedPassword = this.password?.value;
    }
    this.http
      .post(API_URL + '/api/students/updateStudent', {
        email: this.account.email,
        modifiedAccount: {
          name: this.name?.value,
        },
        password: validatedPassword,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          window.location.reload();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  cancelChanges() {
    this.form.reset();
    this.getAccount();
  }

  uploadPicture() {
    this.dialog.open(PictureDialog);
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  template: `
    <div class="p-5 flex flex-col">
      <mat-form-field appearance="fill">
        <mat-label>Image URL</mat-label>
        <input matInput [(ngModel)]="Img" />
      </mat-form-field>
      <button
        class="text-white shadow-black/40 shadow-lg bg-gradient-to-r from-[#6a43ff] to-[#8d46ff] rounded-full p-2"
        (click)="uploadPicture()"
      >
        Upload
      </button>
    </div>
  `,
})
export class PictureDialog {
  constructor(
    public dialogRef: MatDialogRef<PictureDialog>,
    private http: HttpClient
  ) {}
  Img!: string;

  uploadPicture() {
    if (this.Img) {
      const token: any = localStorage.getItem('token');
      const student: any = jwt_decode(token);
      this.http.post(API_URL + '/api/students/uploadPicture', {
        email: student.email,
        Img: this.Img,
      });
      this.dialogRef.close();
      location.reload();
    }
  }
}
