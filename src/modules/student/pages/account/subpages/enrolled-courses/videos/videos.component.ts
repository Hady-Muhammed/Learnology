import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/models/course';
import { API_URL } from 'src/app/services/socketio.service';
import { Teacher } from 'src/app/models/teacher';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
})
export class VideosComponent implements OnInit, OnDestroy {
  opened: boolean = true;
  courseID!: string;
  course!: Course;
  subscription!: Subscription;
  instructor!: Teacher

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.courseID = this.route.snapshot.params['courseID'];
    window.scroll(0,0)
    this.getCourse();
    this.getInstructor(this.courseID)
  }

  getCourse() {
    const sub = this.http
      .get<Course>(API_URL + `/api/courses/getCourse/${this.courseID}`)
      .subscribe((course: Course) => {
        this.course = course;
      });
    this.subscription?.add(sub);
  }

  ngOnInit(): void {}

  toggleContent(): void {
    this.opened = !this.opened;
  }

  getInstructor(id: string) {
    const sub = this.http
      .get<Teacher>(API_URL + `/api/courses/getInstructor/${id}`)
      .subscribe((teacher: Teacher) => (this.instructor = teacher));
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
