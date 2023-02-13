import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Inbox } from 'src/app/models/inbox';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-teacher-inbox-detail',
  templateUrl: './teacher-inbox-detail.component.html',
  styleUrls: ['./teacher-inbox-detail.component.css'],
})
export class TeacherInboxDetailComponent implements OnInit {
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
