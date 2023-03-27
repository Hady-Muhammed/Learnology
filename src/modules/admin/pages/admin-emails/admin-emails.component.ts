import { NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs';
import { Email } from './../../../../app/models/email';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/services/socketio.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-emails',
  templateUrl: './admin-emails.component.html',
  styleUrls: ['./admin-emails.component.css'],
})
export class AdminEmailsComponent implements OnInit {
  emails!: Observable<Email[]>;
  opened!: boolean;
  selectedOption: string = 'Student';
  subject = new FormControl('', [Validators.required]);
  body = new FormControl('', [Validators.required]);

  constructor(private http: HttpClient, public toast: NgToastService) {
    this.getAllEmails();
  }

  ngOnInit(): void {
  }

  getAllEmails() {
    this.emails = this.http.get<Email[]>(API_URL + '/api/emails/getAllEmails');
  }

  emailRead(email: Email) {
    if (!email.read) {
      this.http.patch(API_URL + '/api/emails/emailRead', {
        id: email._id,
      }).subscribe();
    }
  }

  deleteEmail(id: string) {
    this.http.delete(API_URL + `/api/emails/deleteEmail/${id}`).subscribe({
      next: (res: any) => {
        this.toast.success({ detail: res.message });
        this.getAllEmails();
      },
      error: (err) => {
        this.toast.error({ detail: err.message });
      },
    });
  }

  openModal() {
    this.opened = true;
  }

  broadcastToAllStudents() {
    this.http
      .post(API_URL + '/api/inboxes/broadcastToAllStudents', {
        inboxx: {
          subject: this.subject.value,
          sentAt: new Date().toUTCString(),
          body: this.body.value,
          read: false,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.subject.setValue('');
          this.body.setValue('');
          this.opened = false;
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  broadcastToAllTeachers() {
    this.http
      .post(API_URL + '/api/inboxes/broadcastToAllTeachers', {
        inboxx: {
          subject: this.subject.value,
          sentAt: new Date().toUTCString(),
          body: this.body.value,
          read: false,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.subject.setValue('');
          this.body.setValue('');
          this.opened = false;
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  handleBroadcasting() {
    if (!this.body.errors && !this.subject.errors) {
      if (this.selectedOption === 'Student') {
        this.broadcastToAllStudents();
      } else {
        this.broadcastToAllTeachers();
      }
    }
  }
}
