import { Teacher } from './../../../../app/models/teacher';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Inbox } from 'src/app/models/inbox';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-teacher-inbox',
  templateUrl: './teacher-inbox.component.html',
  styleUrls: ['./teacher-inbox.component.css'],
})
export class TeacherInboxComponent implements OnInit, OnDestroy {
  account!: Teacher;
  inboxes!: Observable<Inbox[]>;
  subscription!: Subscription;

  constructor(private http: HttpClient) {
    this.getAccount();
  }

  ngOnInit(): void {
  }

  getAccount(): void {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.getInboxesForTeacher();
      });
    this.subscription?.add(sub);
  }

  getInboxesForTeacher(): void {
    this.inboxes = this.http.get<Inbox[]>(
      API_URL + `/api/inboxes/getInboxesForTeacher/${this.account._id}`
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
