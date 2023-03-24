import { Course } from './../../../../../../app/models/course';
import { API_URL } from './../../../../../../app/services/socketio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledCoursesComponent } from './enrolled-courses.component';
import { Student } from 'src/app/models/student';

describe('EnrolledCoursesComponent', () => {
  let component: EnrolledCoursesComponent;
  let fixture: ComponentFixture<EnrolledCoursesComponent>;
  let httpMock: HttpTestingController
  let mockStudent: Student
  let mockCourses: Course[]
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ EnrolledCoursesComponent ]
    })
    .compileComponents();
    mockStudent = {
      _id: '',
      email: 'test@example.com',
      name: '',
      picture: '',
      password: '',
      createdAt: '',
      enrolled_courses: [],
      liked_teachers: [],
      taken_quizzes: [],
      online: false,
      last_activity: '',
      reacts: [],
      friends: [],
      pendingRequest: false,
      friendRequest: false,
      alreadyFriend: false
    }
    mockCourses = [{
      _id: '',
      instructor_name: '',
      instructor_title: '',
      course_title: '',
      short_desc: '',
      image: '',
      postedAt: '',
      category: '',
      overview: '',
      num_of_likes: 0,
      enrolled_students: [],
      videos: [],
      rating: [],
      price: 0,
      WhatYouWillLearn: []
    }]
    localStorage.setItem("token",token)
    fixture = TestBed.createComponent(EnrolledCoursesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController)
    // Constructor requests
    const req1 = httpMock.expectOne(API_URL + `/api/students/getStudent/${mockStudent.email}`)
    req1.flush(mockStudent)
    const req2 = httpMock.expectOne(API_URL + `/api/courses/getCoursesByIds`)
    req2.flush(mockCourses)
    fixture.detectChanges();
  });
  afterEach(() => {
    httpMock.verify()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
