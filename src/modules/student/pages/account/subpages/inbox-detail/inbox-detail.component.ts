import { Inbox } from './../../../../../../app/models/inbox';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inbox-detail',
  templateUrl: './inbox-detail.component.html',
  styleUrls: ['./inbox-detail.component.css'],
})
export class InboxDetailComponent implements OnInit {
  id!: string;
  inbox!: Inbox;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    this.getInbox();
  }

  ngOnInit(): void {}

  getInbox() {
    this.http
      .get<Inbox>(API_URL + `/api/inboxes/getInbox/${this.id}`)
      .subscribe((inbox: Inbox) => (this.inbox = inbox));
  }

  return() {
    window.history.back();
  }
}
