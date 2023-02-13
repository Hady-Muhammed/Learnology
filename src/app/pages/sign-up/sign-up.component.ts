import { API_URL } from './../../services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', [
    Validators.required,
    Validators.maxLength(15),
    Validators.minLength(5),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);
  checked = false;
  loading = false;
  selectedOption!: any;
  @ViewChild('checkbox') check!: any;
  constructor(
    private http: HttpClient,
    private toast: NgToastService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {}

  signUp() {
    // Validating confirm password field
    if (this.password.value !== this.confirmPassword.value)
      this.confirmPassword.setErrors({ notIdentical: true });

    if (!this.checked) this.check.change.hasError = true;

    if (
      !this.email.errors &&
      !this.name.errors &&
      !this.password.errors &&
      !this.confirmPassword.errors &&
      this.checked
    ) {
      this.openDialog();
    }
  }

  openDialog() {
    const dialg = this.dialog.open(DialogComponent);
    dialg.afterClosed().subscribe((result) => {
      this.selectedOption = result;
      if (this.selectedOption === 'Student') {
        this.loading = true;
        this.http
          .post<any>(API_URL + '/api/students', {
            email: this.email.value,
            name: this.name.value,
            picture: 'default',
            password: this.password.value,
            createdAt: new Date().toUTCString(),
            enrolled_courses: [],
            liked_teachers: [],
            taken_quizzes: [],
            reacts: [],
            friends: [],
            last_activity: new Date().toUTCString(),
          })
          .subscribe({
            next: (data) => {
              setTimeout(() => {
                this.loading = false;
                this.toast.success({ detail: 'Account created successfully' });
                setTimeout(() => {
                  this.router.navigateByUrl('/signin');
                }, 1000);
              }, 4000);
            },
            error: (error) => {
              setTimeout(() => {
                this.loading = false;
                this.toast.error({ detail: 'Account already exists' });
              }, 4000);
            },
          });
      } else if (this.selectedOption === 'Teacher') {
        this.loading = true;
        this.http
          .post<any>(API_URL + '/api/teachers', {
            name: this.name.value,
            email: this.email.value,
            password: this.password.value,
            title: 'Instructor',
            picture: 'default',
            courses_teaching: [],
            createdAt: new Date().toUTCString(),
            articles_published: [],
            quizzes_published: [],
            likes: 0,
            last_activity: new Date().toUTCString(),
          })
          .subscribe({
            next: (data) => {
              setTimeout(() => {
                this.loading = false;
                this.toast.success({ detail: 'Account created successfully' });
                setTimeout(() => {
                  this.router.navigateByUrl('/signin');
                }, 1000);
              }, 4000);
            },
            error: (error) => {
              setTimeout(() => {
                this.loading = false;
                this.toast.error({ detail: 'Account already exists' });
              }, 4000);
            },
          });
      }
    });
  }

}

@Component({
  selector: 'app-dialog',
  template: `
    <div class="space-y-2">
      <h1 class="font-mont" mat-dialog-title>
        Are you a student or a teacher?
      </h1>
      <mat-radio-group
        class="space-x-3"
        [(ngModel)]="selectedOption"
        aria-label="Select an option"
      >
        <mat-radio-button class="font-mont" value="Student"
          >Student</mat-radio-button
        >
        <mat-radio-button class="font-mont" value="Teacher"
          >Teacher</mat-radio-button
        >
      </mat-radio-group>
      <div mat-dialog-actions>
        <button
          class="font-mont text-white shadow-black/40 shadow-lg bg-gradient-to-r from-[#6a43ff] to-[#8d46ff] p-2"
          [mat-dialog-close]="selectedOption"
          mat-dialog-close
        >
          SUBMIT
        </button>
      </div>
    </div>
  `,
})
export class DialogComponent implements OnInit {
  selectedOption!: any;
  constructor() {}
  ngOnInit(): void {}
}
