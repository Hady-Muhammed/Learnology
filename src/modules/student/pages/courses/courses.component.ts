import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from 'src/app/models/course';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses!: Course[];
  filteredCourses!: Course[];
  subscription!: Subscription
  searchTerm = new FormControl('');
  constructor(private http: HttpClient) {
    this.getAllCourses();
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {}

  filterData():void {
    if (this.searchTerm.value) {
      this.filteredCourses = this.courses.filter((crs: any) =>
        crs.course_title.toLowerCase().includes(this.searchTerm.value)
      );
    } else {
      this.filteredCourses = this.courses;
    }
  }

  getAllCourses(): void {
    this.subscription = this.http
      .get<Course[]>(API_URL + '/api/courses/getAllCourses')
      .subscribe((courses: Course[]) => {
        this.courses = courses;
        this.filteredCourses = courses;
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
