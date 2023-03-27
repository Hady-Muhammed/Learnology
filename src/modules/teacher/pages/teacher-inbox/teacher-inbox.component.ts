import { Teacher } from './../../../../app/models/teacher';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { NgToastService } from 'ng-angular-popup';
import { Inbox } from 'src/app/models/inbox';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-teacher-inbox',
  templateUrl: './teacher-inbox.component.html',
  styleUrls: ['./teacher-inbox.component.css'],
})
export class TeacherInboxComponent implements OnInit {
  account!: Teacher;
  inboxes!: Observable<Inbox[]>;

  constructor(private http: HttpClient, private toast: NgToastService) {
    this.getAccount();
  }

  ngOnInit(): void {
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.getInboxesForTeacher();
      });
  }

  getInboxesForTeacher() {
    this.inboxes = this.http.get<Inbox[]>(
      API_URL + `/api/inboxes/getInboxesForTeacher/${this.account._id}`
    );
  }
}
