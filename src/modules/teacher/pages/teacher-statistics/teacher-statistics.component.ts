import { API_URL } from './../../../../app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Teacher } from 'src/app/models/teacher';

@Component({
  selector: 'app-teacher-statistics',
  templateUrl: './teacher-statistics.component.html',
  styleUrls: ['./teacher-statistics.component.css'],
})
export class TeacherStatisticsComponent implements OnInit {
  account!: Teacher;
  constructor(
    private http: HttpClient,
  ) {
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
      });
  }
}
