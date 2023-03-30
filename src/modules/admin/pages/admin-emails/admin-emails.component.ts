import { NgToastService } from 'ng-angular-popup';
import { Observable, Subscription } from 'rxjs';
import { Email } from './../../../../app/models/email';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/services/socketio.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-emails',
  templateUrl: './admin-emails.component.html',
  styleUrls: ['./admin-emails.component.css'],
})
export class AdminEmailsComponent implements OnInit, OnDestroy {
  emails!: Observable<Email[]>;
  opened!: boolean;
  selectedOption: string = 'Student';
  subject = new FormControl('', [Validators.required]);
  body = new FormControl('', [Validators.required]);
  subscription!: Subscription;

  constructor(private http: HttpClient, public toast: NgToastService) {
    this.getAllEmails();
  }

  ngOnInit(): void {}

  getAllEmails(): void {
    this.emails = this.http.get<Email[]>(API_URL + '/api/emails/getAllEmails');
  }

  emailRead(email: Email): void {
    if (!email.read) {
      const sub = this.http
        .patch(API_URL + '/api/emails/emailRead', {
          id: email._id,
        })
        .subscribe();
      this.subscription?.add(sub);
    }
  }

  deleteEmail(id: string): void {
    const sub = this.http
      .delete(API_URL + `/api/emails/deleteEmail/${id}`)
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getAllEmails();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
    this.subscription?.add(sub);
  }

  openModal(): void {
    this.opened = true;
  }

  broadcastToAllStudents(): void {
    const sub = this.http
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
    this.subscription?.add(sub);
  }

  broadcastToAllTeachers(): void {
    const sub = this.http
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
    this.subscription?.add(sub);
  }

  handleBroadcasting(): void {
    if (!this.body.errors && !this.subject.errors) {
      if (this.selectedOption === 'Student') {
        this.broadcastToAllStudents();
      } else {
        this.broadcastToAllTeachers();
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
