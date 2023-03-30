import { Subscription } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/models/course';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course!: Course;
  id: string;
  text!: string;
  instructor!: Teacher;
  isEnrolled: boolean = false;
  subscription!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public toast: NgToastService,
    public router: Router
  ) {
    this.id = this.route.snapshot.params['id'];
    this.getCourse(this.id);
    this.getInstructor(this.id);
    this.courseIsEnrolled();
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {}

  courseIsEnrolled() {
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe({
        next: (student: Student) => {
          const courseExists = student.enrolled_courses.find(
            (crs: any) => crs === this.id
          );

          if (!courseExists) {
            this.text = 'Enroll Course';
            this.isEnrolled = false;
          } else {
            this.text = 'Already Enrolled';
            this.isEnrolled = true;
          }
        },
      });
    this.subscription?.add(sub);
  }

  getInstructor(id: string) {
    const sub = this.http
      .get<Teacher>(API_URL + `/api/courses/getInstructor/${id}`)
      .subscribe((teacher: Teacher) => (this.instructor = teacher));
    this.subscription?.add(sub);
  }

  getCourse(id: string) {
    const sub = this.http
      .get<Course>(API_URL + `/api/courses/getCourse/${id}`)
      .subscribe({
        next: (course: Course) => {
          this.course = course;
        },
      });
    this.subscription?.add(sub);
  }

  enrollCourse() {
    const token: any = localStorage.getItem('token');
    const student: any = jwt_decode(token);
    const sub = this.http
      .post(API_URL + `/api/students/enrollCourse`, {
        email: student.email,
        course: this.course,
      })
      .subscribe({
        next: (data: any) => {
          this.toast.success({ detail: data.message });
          this.router.navigateByUrl('/courses');
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
