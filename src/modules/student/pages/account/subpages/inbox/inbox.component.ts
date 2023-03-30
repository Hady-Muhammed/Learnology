import { Observable, Subscription } from 'rxjs';
import { Inbox } from './../../../../../../app/models/inbox';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit , OnDestroy {
  account!: Student;
  inboxes!: Observable<Inbox[]>;
  subscription!: Subscription;

  constructor(private http: HttpClient) {
    this.getAccount();
  }

  ngOnInit(): void {
  }

  getAccount(): void {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.getInboxesForStudent();
      });
    this.subscription?.add(sub);
  }

  getInboxesForStudent(): void {
    this.inboxes = this.http.get<Inbox[]>(
      API_URL + `/api/inboxes/getInboxesForStudent/${this.account._id}`
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
