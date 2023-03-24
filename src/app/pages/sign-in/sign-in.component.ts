import { API_URL } from './../../services/socketio.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);
  loading: boolean = false;
  constructor(
    private http: HttpClient,
    private toast: NgToastService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  proceedSignIn() {
    if (!this.email.errors && !this.password.errors) {
      this.loading = true;
      if (this.isAdmin()) {
        this.signInAsAdmin()
        return;
      }
      this.signInAsStudent()
    }
  }

  signInAsStudent() {
    this.http.post(API_URL + "/api/students/login", {
      email: this.email.value,
      password: this.password.value,
    }).subscribe({
      next: (res:any) => {
        localStorage.setItem('token', res.token);
        setTimeout(() => {
          this.loading = false;
          this.toast.success({ detail: 'Logged in successfully!' });
          this.navigateToStudentAuthorities()
        }, 4000);
      },
      error: err => {
        if(err.error.message === 'Email not valid!') {
          this.signInAsTeacher()
        } else {
          this.toast.error({detail: err.error.message})
          this.loading = false
        }
      }
    })
  }

  signInAsTeacher() {
    this.http.post(API_URL + "/api/teachers/login", {
      email: this.email.value,
      password: this.password.value,
    }).subscribe({
      next: (res:any) => {
        localStorage.setItem('token', res.token);
        setTimeout(() => {
          this.loading = false;
          this.toast.success({ detail: 'Logged in successfully!' });
          this.navigateToTeacherAuthorities()
        }, 4000);
      },
      error: err => {
        this.toast.error({detail: err.error.message})
        this.loading = false
      }
    })
  }

  signInAsAdmin() {
    localStorage.setItem(
      'token',
      JSON.stringify({
        email: 'admin@gmail.com',
        password: 'admin',
      })
    );
    this.navigateToAdminAuthorities()
  }

  navigateToAdminAuthorities() {
    this.router.navigateByUrl('/admin');
  }

  navigateToStudentAuthorities() {
    this.router.navigateByUrl('/');
  }

  navigateToTeacherAuthorities() {
    this.router.navigateByUrl('/teacher');
  }

  isAdmin(): boolean {
    return this.email.value === 'admin@gmail.com' && this.password.value === 'admin'
  }
}
