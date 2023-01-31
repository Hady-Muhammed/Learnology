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
  email = new FormControl('', [Validators.required, Validators.email]);
  message = new FormControl('', [Validators.required]);

  constructor(
    private http: HttpClient,
  ) {
    window.scrollTo(0, 0);
    this.getAccount()
  }

  ngOnInit(): void {}

  sendEmail() {
    this.http
      .post(API_URL + '/api/students/sendEmail', {
        email: this.email.value,
        fname: this.fname.value,
        lname: this.lname.value,
        message: this.message.value,
      })
      .subscribe((data) => console.log(data));
    this.email.setValue('');
    this.email.setErrors(null);
    this.fname.setValue('');
    this.fname.setErrors(null);
    this.lname.setValue('');
    this.lname.setErrors(null);
    this.message.setValue('');
    this.message.setErrors(null);
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
      });
  }
}
