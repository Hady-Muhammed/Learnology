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
  checked: boolean = false;
  loading: boolean = false;
  selectedOption!: string;
  constructor(
    private http: HttpClient,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  signIn() {
    if (!this.email.errors && !this.password.errors) {
      this.loading = true;
      this.http
        .post<any>(API_URL + '/api/students/login', {
          email: this.email.value,
          password: this.password.value,
        })
        .subscribe({
          next: (data) => {
            console.log(data);
            localStorage.setItem('token', data.token);
            setTimeout(() => {
              this.loading = false;
              this.toast.success({ detail: 'Logged in successfully!' });
              this.router.navigateByUrl('/');
            }, 4000);
          },
          error: (error) => {
            if (error.error.message === 'Email not valid!') {
              this.http
                .post<any>(API_URL + '/api/teachers/login', {
                  email: this.email.value,
                  password: this.password.value,
                })
                .subscribe({
                  next: (data) => {
                    console.log(data);
                    localStorage.setItem('token', data.token);
                    setTimeout(() => {
                      this.loading = false;
                      this.toast.success({ detail: 'Logged in successfully!' });
                      this.router.navigateByUrl('/teacher');
                    }, 4000);
                  },
                  error: (error) => {
                    setTimeout(() => {
                      this.loading = false;
                      this.toast.error({ detail: error.error.message });
                    }, 4000);
                  },
                });
            } else {
              setTimeout(() => {
                this.loading = false;
                this.toast.error({ detail: error.error.message });
              }, 4000);
            }
          },
        });
    }
  }
}
