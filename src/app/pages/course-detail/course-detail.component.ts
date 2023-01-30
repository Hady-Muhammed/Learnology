import { API_URL } from './../../services/socketio.service';
import { Teacher } from './../../models/teacher';
import { Student } from './../../models/student';
import { Course } from './../../models/course';
import { NgToastService } from 'ng-angular-popup';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})
export class CourseDetailComponent implements OnInit {
  course!: Course;
  id: string;
  text!: string;
  instructor!: Teacher;
  isEnrolled: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toast: NgToastService,
    private router: Router
  ) {
    this.id = route.snapshot.params['id'];
    this.getCourse(this.id);
    this.getInstructor(this.id);
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.courseIsEnrolled();
  }

  courseIsEnrolled() {
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe({
        next: (student: Student) => {
          const courseExists = student.enrolled_courses.find(
            (crs: any) => crs === this.id
          );
          console.log(courseExists);
          if (!courseExists) {
            this.text = 'Enroll Course';
            this.isEnrolled = false;
          } else {
            this.text = 'Already Enrolled';
            this.isEnrolled = true;
          }
        },
        error: (data) => {
          console.log(data);
        },
      });
  }

  getInstructor(id: string) {
    this.http
      .get<Teacher>(API_URL + `/api/courses/getInstructor/${id}`)
      .subscribe((teacher: Teacher) => (this.instructor = teacher));
  }

  getCourse(id: string) {
    this.http.get<Course>(API_URL + `/api/courses/getCourse/${id}`).subscribe({
      next: (course: Course) => {
        console.log(course);
        this.course = course;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  enrollCourse() {
    const token: any = localStorage.getItem('token');
    const student: any = jwt_decode(token);
    this.http
      .post(API_URL + `/api/students/enrollCourse`, {
        email: student.email,
        course: this.course,
      })
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.toast.success({ detail: data.message });
          this.router.navigateByUrl('/courses');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
