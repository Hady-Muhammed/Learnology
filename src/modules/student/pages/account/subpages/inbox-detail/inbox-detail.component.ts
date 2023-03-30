import { Inbox } from './../../../../../../app/models/inbox';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inbox-detail',
  templateUrl: './inbox-detail.component.html',
  styleUrls: ['./inbox-detail.component.css'],
})
export class InboxDetailComponent implements OnInit, OnDestroy {
  id!: string;
  inbox!: Inbox;
  subscription!: Subscription;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    this.getInbox();
  }

  ngOnInit(): void {}

  getInbox(): void {
    const sub = this.http
      .get<Inbox>(API_URL + `/api/inboxes/getInbox/${this.id}`)
      .subscribe((inbox: Inbox) => (this.inbox = inbox));
    this.subscription?.add(sub);
  }

  return(): void {
    window.history.back();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
