import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  courses!: Course[];
  filteredCourses!: Course[];
  searchTerm = new FormControl('');
  constructor(private http: HttpClient) {
    this.getAllCourses();
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {}

  filterData() {
    if (this.searchTerm.value) {
      this.filteredCourses = this.courses.filter((crs: any) =>
        crs.course_title.toLowerCase().includes(this.searchTerm.value)
      );
    } else {
      this.filteredCourses = this.courses;
    }
  }


  getAllCourses() {
    this.http
      .get<Course[]>(API_URL + '/api/courses/getAllCourses')
      .subscribe((courses: Course[]) => {
        this.courses = courses;
        this.filteredCourses = courses;
      });
  }
}
