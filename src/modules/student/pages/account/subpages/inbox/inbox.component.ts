import { Observable } from 'rxjs';
import { Inbox } from './../../../../../../app/models/inbox';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit {
  account!: Student;
  inboxes!: Observable<Inbox[]>;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAccount();
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.getInboxesForStudent();
      });
  }

  getInboxesForStudent() {
    this.inboxes = this.http.get<Inbox[]>(
      API_URL + `/api/inboxes/getInboxesForStudent/${this.account._id}`
    );
  }
}
