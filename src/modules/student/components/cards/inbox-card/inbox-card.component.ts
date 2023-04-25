import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './../../../../../app/services/socketio.service';
import { Inbox } from './../../../../../app/models/inbox';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-inbox-card',
  templateUrl: './inbox-card.component.html',
  styleUrls: ['./inbox-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxCardComponent implements OnInit {
  @Input('inbox') inbox!: Inbox;
  @Output() inboxDeleted = new EventEmitter();

  constructor(private http: HttpClient, public toast: NgToastService) {}

  ngOnInit(): void {}

  inboxRead(inbox: Inbox) {
    if (!inbox.read) {
      this.http.patch(API_URL + '/api/inboxes/inboxRead', {
        id: inbox._id,
      }).subscribe((res: any) => true);
    }
  }

  deleteInbox(id: string) {
    this.http.delete(API_URL + `/api/inboxes/deleteInbox/${id}`).subscribe({
      next: (res: any) => {
        this.toast.success({ detail: res.message });
        this.inboxDeleted.emit(true);
      },
      error: (err) => {
        this.toast.error({ detail: err.message });
      },
    });
  }
}
