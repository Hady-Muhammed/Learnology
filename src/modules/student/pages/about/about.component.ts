import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  teachers!: Observable<Teacher[]>;
  constructor(private http: HttpClient) {
    window.scrollTo(0, 0);
    this.getAllTeachers();
  }

  ngOnInit(): void {}

  getAllTeachers() {
    this.teachers = this.http
      .get<Teacher[]>(API_URL + '/api/teachers/getAllTeachers')
  }
}
