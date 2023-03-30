import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Course } from 'src/app/models/course';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';

  const mockStudent: Student = {
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
    alreadyFriend: false,
  };

  const mockCourses: Course[] = [
    {
      _id: '1',
      instructor_name: 'John Doe',
      instructor_title: 'Professor',
      course_title: 'Test Course 1',
      short_desc: 'Test course description 1',
      image: 'test-course-1.jpg',
      postedAt: '2022-03-20',
      category: 'Test Category 1',
      overview: 'Test course overview 1',
      num_of_likes: 10,
      enrolled_students: ['student1', 'student2'],
      videos: [],
      rating: [],
      price: 50,
      WhatYouWillLearn: ['Learn topic 1', 'Learn topic 2'],
    },
    {
      _id: '2',
      instructor_name: 'Jane Smith',
      instructor_title: 'Professor',
      course_title: 'Test Course 2',
      short_desc: 'Test course description 2',
      image: 'test-course-2.jpg',
      postedAt: '2022-03-21',
      category: 'Test Category 2',
      overview: 'Test course overview 2',
      num_of_likes: 5,
      enrolled_students: ['student3', 'student4'],
      videos: [],
      rating: [],
      price: 75,
      WhatYouWillLearn: ['Learn topic 3', 'Learn topic 4'],
    },
    {
      _id: '3',
      instructor_name: 'Bob Johnson',
      instructor_title: 'Professor',
      course_title: 'Test Course 3',
      short_desc: 'Test course description 3',
      image: 'test-course-3.jpg',
      postedAt: '2022-03-22',
      category: 'Test Category 3',
      overview: 'Test course overview 3',
      num_of_likes: 20,
      enrolled_students: ['student5', 'student6'],
      videos: [],
      rating: [],
      price: 100,
      WhatYouWillLearn: ['Learn topic 5', 'Learn topic 6'],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
    localStorage.setItem("token",token)
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    // Constructor requests
    const req1 = httpMock.expectOne(
      API_URL + `/api/students/getStudent/${mockStudent.email}`
    );
    req1.flush(mockStudent)
    fixture.detectChanges();
    const req2 = httpMock.expectOne(
      API_URL + `/api/courses/getPopularCourses`
    );
    req2.flush(mockCourses)
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy()
  })
});
