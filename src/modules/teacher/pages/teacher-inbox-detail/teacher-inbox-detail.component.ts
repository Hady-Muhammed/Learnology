import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Inbox } from 'src/app/models/inbox';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-teacher-inbox-detail',
  templateUrl: './teacher-inbox-detail.component.html',
  styleUrls: ['./teacher-inbox-detail.component.css'],
})
export class TeacherInboxDetailComponent implements OnInit, OnDestroy {
  id!: string;
  inbox!: Inbox;
  subscription!: Subscription;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    this.getInbox();
  }

  ngOnInit(): void {}

  getInbox() {
    const sub = this.http
      .get<Inbox>(API_URL + `/api/inboxes/getInbox/${this.id}`)
      .subscribe((inbox: Inbox) => (this.inbox = inbox));
    this.subscription?.add(sub);
  }

  return() {
    window.history.back();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
