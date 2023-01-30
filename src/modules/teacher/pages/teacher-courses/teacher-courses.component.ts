import { API_URL } from './../../../../app/services/socketio.service';
import { NgToastService } from 'ng-angular-popup';
import { Course } from './../../../../app/models/course';
import { Teacher } from './../../../../app/models/teacher';
import { HttpClient } from '@angular/common/http';
import jwtDecode from 'jwt-decode';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher-courses',
  templateUrl: './teacher-courses.component.html',
  styleUrls: ['./teacher-courses.component.css'],
})
export class TeacherCoursesComponent implements OnInit {
  account!: Teacher;
  courses!: Course[];
  constructor(private http: HttpClient, private toast: NgToastService) {}

  ngOnInit(): void {
    this.getAccount();
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.getCourses(teacher.courses_teaching);
      });
  }

  getCourses(courses: string[]) {
    this.http
      .post<Course[]>(API_URL + '/api/courses/getCoursesByIds', {
        courses,
      })
      .subscribe((courses: Course[]) => (this.courses = courses));
  }

  deleteCourse(id: string) {
    this.http
      .post(API_URL + `/api/courses/deleteCourse`, {
        email: this.account.email,
        id,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.toast.success({ detail: res.message });
          this.getAccount();
        },
        error: (err) => {
          console.log(err);
          this.toast.error({ detail: err.message });
        },
      });
  }
}
