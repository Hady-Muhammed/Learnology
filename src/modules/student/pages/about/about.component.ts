import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  teachers!: Teacher[];
  account!: Student;
  constructor(
    private http: HttpClient,
  ) {
    window.scrollTo(0, 0);
    this.getAllTeachers();
    this.getAccount();
  }

  ngOnInit(): void {
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student
      });
  }

  getAllTeachers() {
    this.http
      .get<Teacher[]>(API_URL + '/api/teachers/getAllTeachers')
      .subscribe((teachers: Teacher[]) => (this.teachers = teachers));
  }
}
