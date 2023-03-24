import { API_URL } from './../../services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  form = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.maxLength(15), Validators.minLength(5)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
    checked: [false, [Validators.required]],
  });
  loading = false;
  selectedOption!: string;
  @ViewChild('checkbox') check!: any;
  constructor(
    private http: HttpClient,
    public toast: NgToastService,
    public router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {}

  /* Form Getters */
  get name() {
    return this.form.get('name');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
  get checked() {
    return this.form.get('checked');
  }

  proceedSignUp() {
    // Validating confirm password field
    if (this.password?.value !== this.confirmPassword?.value)
      this.confirmPassword?.setErrors({ notIdentical: true });

    if (!this.checked?.value) this.check.change.hasError = true;
    else this.check.change.hasError = false;
    if (
      !this.email?.errors &&
      !this.name?.errors &&
      !this.password?.errors &&
      !this.confirmPassword?.errors &&
      this.checked?.value
    ) {
      this.openDialog();
    }
  }

  openDialog() {
    const dialog = this.dialog.open(DialogComponent);
    dialog.afterClosed().subscribe((result) => {
      this.selectedOption = result;
      if (this.selectedOption === 'Student') {
        this.loading = true;
        this.createStudentAccount();
      } else if (this.selectedOption === 'Teacher') {
        this.loading = true;
        this.createTeacherAccount();
      }
    });
  }

  createStudentAccount() {
    this.http
      .post<any>(API_URL + '/api/students/', {
        email: this.email?.value,
        name: this.name?.value,
        picture: 'default',
        password: this.password?.value,
        createdAt: new Date().toUTCString(),
        enrolled_courses: [],
        liked_teachers: [],
        taken_quizzes: [],
        reacts: [],
        friends: [],
        last_activity: new Date().toUTCString(),
      })
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.loading = false;
            this.toast.success({ detail: 'Account created successfully' });
            setTimeout(() => {
              this.router.navigateByUrl('/signin');
            }, 1000);
          }, 4000);
        },
        error: () => {
          setTimeout(() => {
            this.loading = false;
            this.toast.error({ detail: 'Account already exists' });
          }, 4000);
        },
      });
  }

  createTeacherAccount() {
    this.http
      .post<any>(API_URL + '/api/teachers/', {
        name: this.name?.value,
        email: this.email?.value,
        password: this.password?.value,
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
        next: () => {
          setTimeout(() => {
            this.loading = false;
            this.toast.success({ detail: 'Account created successfully' });
            setTimeout(() => {
              this.router.navigateByUrl('/signin');
            }, 1000);
          }, 4000);
        },
        error: () => {
          setTimeout(() => {
            this.loading = false;
            this.toast.error({ detail: 'Account already exists' });
          }, 4000);
        },
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
