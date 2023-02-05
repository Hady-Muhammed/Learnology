import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  fname = new FormControl('', [Validators.required]);
  lname = new FormControl('', [Validators.required]);
  subject = new FormControl('', [Validators.required]);
  body = new FormControl('', [Validators.required]);
  account!: Student;

  constructor(private http: HttpClient , private toast: NgToastService) {
    window.scrollTo(0, 0);
    this.getAccount();
  }

  ngOnInit(): void {}

  sendEmail() {
    if (
      !this.fname.errors &&
      !this.lname.errors &&
      !this.subject.errors &&
      !this.body.errors
    ) {
      this.http
        .post(API_URL + '/api/emails/sendEmail', {
          email: {
            subject: this.subject.value,
            sentAt: new Date().toUTCString(),
            belongsTo: this.account._id,
            body: this.body.value,
            read: false,
            replied: false,
          },
        })
        .subscribe({
          next: (res: any) => {
            this.toast.success({ detail: res.message });
          },
          error: (err) => {
            this.toast.error({ detail: err.message });
          },
        });
      this.subject.setValue('');
      this.subject.setErrors(null);
      this.body.setValue('');
      this.body.setErrors(null);
      this.fname.setValue('');
      this.fname.setErrors(null);
      this.lname.setValue('');
      this.lname.setErrors(null);
    }
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
      });
  }
}
