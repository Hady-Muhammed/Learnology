import { NgToastService } from 'ng-angular-popup';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Course } from 'src/app/models/course';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import jwtDecode from 'jwt-decode';

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
    private socketService: SocketioService,
    private router: Router
  ) {
    this.id = route.snapshot.params['id'];
    this.getCourse(this.id);
    this.getInstructor(this.id);
    window.scrollTo(0, 0);
    this.getAccount()
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

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.socketService.online(student._id);
        this.socketService.setupSocketConnection(student.email);
      });
  }
}
