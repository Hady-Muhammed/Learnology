import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-enrolled-courses',
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.css'],
})
export class EnrolledCoursesComponent implements OnInit {
  enrolledCourses!: Course[];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getStudent();
  }
  getStudent() {
    const token: any = localStorage.getItem('token');
    const student: any = jwt_decode(token);
    this.http
      .get<Student>(API_URL+`/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.http.post<Course[]>(API_URL+'/api/courses/getCoursesByIds', {
          courses: student.enrolled_courses
        }).subscribe((courses: Course[]) => {
          this.enrolledCourses = courses
        })
      });
  }
}
