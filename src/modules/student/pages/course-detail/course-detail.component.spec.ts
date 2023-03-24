import { Course } from 'src/app/models/course';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NgToastService } from 'ng-angular-popup';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { CourseDetailComponent } from './course-detail.component';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

class MockActivatedRoute {
  snapshot = {
    params: {
      id: '1234',
    },
  };
}

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;
  let httpMock: HttpTestingController;
  let toastService: NgToastService;
  let router: Router;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockStudent: Student;
  let mockCourse: Course = {
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
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [CourseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute,
        },
      ],
    }).compileComponents();
    mockStudent = {
      _id: '',
      email: 'test@example.com',
      name: '',
      picture: '',
      password: '',
      createdAt: '',
      enrolled_courses: ['1234'],
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
    localStorage.setItem('token', token);
    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(
      `${API_URL}/api/students/getStudent/${mockStudent.email}`
    );
    req1.flush(mockStudent);
    const req2 = httpMock.expectOne(
      `${API_URL}/api/courses/getCourse/${component.id}`
    );
    req2.flush(mockCourse);
    const req3 = httpMock.expectOne(
      `${API_URL}/api/courses/getInstructor/${component.id}`
    );
    req3.flush(null);
    toastService = TestBed.inject(NgToastService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('courseIsEnrolled()', () => {
    it('should set isEnrolled to true if course is already enrolled', () => {
      component.courseIsEnrolled();

      const req = httpMock.expectOne(
        `${API_URL}/api/students/getStudent/${mockStudent.email}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockStudent);

      expect(component.isEnrolled).toBeTrue();
      expect(component.text).toEqual('Already Enrolled');
    });

    it('should set isEnrolled to false if course is not enrolled', () => {
      mockStudent.enrolled_courses[0] = '123456';
      console.log(mockStudent);
      component.courseIsEnrolled();

      const req = httpMock.expectOne(
        `${API_URL}/api/students/getStudent/${mockStudent.email}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(mockStudent);

      expect(component.isEnrolled).toBeFalse();
      expect(component.text).toEqual('Enroll Course');
    });
  });

  describe('enrollCourse()', () => {
    it('should enroll/buy course', () => {
      spyOn(component.toast, 'success');
      spyOn(component.router, 'navigateByUrl');
      component.enrollCourse();

      const req = httpMock.expectOne(API_URL + `/api/students/enrollCourse`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({
        email: mockStudent.email,
        course: component.course,
      });
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.router.navigateByUrl).toHaveBeenCalledWith('/courses');
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.enrollCourse();

      const req = httpMock.expectOne(API_URL + `/api/students/enrollCourse`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({
        email: mockStudent.email,
        course: component.course,
      });
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
