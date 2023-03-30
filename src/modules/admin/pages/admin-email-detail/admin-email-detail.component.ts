import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Email } from 'src/app/models/email';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-email-detail',
  templateUrl: './admin-email-detail.component.html',
  styleUrls: ['./admin-email-detail.component.css'],
})
export class AdminEmailDetailComponent implements OnInit, OnDestroy {
  email!: Email;
  id!: string;
  opened!: boolean;
  subject = new FormControl('', [Validators.required]);
  body = new FormControl('', [Validators.required]);
  subscription!: Subscription;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public toast: NgToastService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.getEmail(this.id);
  }

  ngOnInit(): void {}

  getEmail(id: string): void {
    const sub = this.http
      .get<Email>(API_URL + `/api/emails/getEmail/${id}`)
      .subscribe((email: any) => (this.email = email[0]));
    this.subscription?.add(sub);
  }

  sendInbox(): void {
    const sub = this.http
      .post(API_URL + '/api/inboxes/sendInbox', {
        inbox: {
          to: this.email.sender?._id,
          subject: this.subject.value,
          sentAt: new Date().toUTCString(),
          body: this.body.value,
          read: false,
          replied: false,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.emailGotReplied();
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

  emailGotReplied(): void {
    const sub = this.http
      .patch(API_URL + `/api/emails/emailGotReplied`, {
        emailID: this.email._id,
      })
      .subscribe({
        next: (res: any) => {
          this.getEmail(this.id);
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
