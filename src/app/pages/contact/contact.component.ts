import { API_URL } from './../../services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

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

  constructor(private http: HttpClient) {
    window.scrollTo(0, 0);
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
}
