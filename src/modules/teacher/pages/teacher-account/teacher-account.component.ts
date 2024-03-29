import { API_URL } from './../../../../app/services/socketio.service';
import { Teacher } from './../../../../app/models/teacher';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-account',
  templateUrl: './teacher-account.component.html',
  styleUrls: ['./teacher-account.component.css'],
})
export class TeacherAccountComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  account!: Teacher;
  loading: boolean = false;
  subscription!: Subscription;

  constructor(
    private http: HttpClient,
    public toast: NgToastService,
    public router: Router,
    public dialog: MatDialog
  ) {
    this.getAccount();
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  /* Form Fields Getters */
  get name() {
    return this.form.get('name');
  }
  get title() {
    return this.form.get('title');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  /* Form Fields Getters */
  ngOnInit(): void {}

  getAccount(): void {
    const token = localStorage.getItem('token') || '';
    const teacher: any = jwt_decode(token);
    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.name?.setValue(this.account.name);
        this.title?.setValue(this.account.title);
        this.email?.setValue(this.account.email);
        this.email?.disable();
        this.password?.setValue(this.account.password.slice(0, 16));
      });
    this.subscription?.add(sub);
  }

  deleteTeacher(): void {
    const sub = this.http
      .post(API_URL + `/api/teachers/deleteTeacher`, {
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
    this.subscription?.add(sub);
  }

  uploadPicture(): void {
    this.dialog.open(PictureDialog);
  }

  updateTeacher(): void {
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
    const sub = this.http
      .post(API_URL + `/api/teachers/updateTeacher`, {
        email: this.account.email,
        modifiedAccount: {
          name: this.name?.value,
          title: this.title?.value,
        },
        password: validatedPassword,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getAccount();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
    this.subscription?.add(sub);
  }

  cancelChanges(): void {
    this.getAccount();
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
export class PictureDialog implements OnDestroy {
  subscription!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<PictureDialog>,
    private http: HttpClient
  ) {}
  Img!: string;

  uploadPicture() {
    if (this.Img) {
      const token: any = localStorage.getItem('token');
      const teacher: any = jwt_decode(token);
      const sub = this.http
        .post(API_URL + '/api/teachers/uploadPicture', {
          email: teacher.email,
          Img: this.Img,
        })
        .subscribe();
      this.dialogRef.close();
      this.refreshPage();
      this.subscription?.add(sub);
    }
  }

  refreshPage() {
    location.reload();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
