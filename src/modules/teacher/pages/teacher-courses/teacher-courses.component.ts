import { API_URL } from './../../../../app/services/socketio.service';
import { NgToastService } from 'ng-angular-popup';
import { Course } from './../../../../app/models/course';
import { Teacher } from './../../../../app/models/teacher';
import { HttpClient } from '@angular/common/http';
import jwtDecode from 'jwt-decode';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-courses',
  templateUrl: './teacher-courses.component.html',
  styleUrls: ['./teacher-courses.component.css'],
})
export class TeacherCoursesComponent implements OnInit, OnDestroy {
  account!: Teacher;
  courses!: Course[];
  subscription!: Subscription;

  constructor(private http: HttpClient, public toast: NgToastService) {
    this.getAccount();
  }

  ngOnInit(): void {}

  getAccount(): void {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.getCourses(teacher.courses_teaching);
      });
    this.subscription?.add(sub);
  }

  getCourses(courses: string[]): void {
    const sub = this.http
      .post<Course[]>(API_URL + '/api/courses/getCoursesByIds', {
        courses,
      })
      .subscribe((courses: Course[]) => (this.courses = courses));
    this.subscription?.add(sub);
  }

  deleteCourse(id: string): void {
    const sub = this.http
      .post(API_URL + `/api/courses/deleteCourse`, {
        email: this.account.email,
        id,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getAccount();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
