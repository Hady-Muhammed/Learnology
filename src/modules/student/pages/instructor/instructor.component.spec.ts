import { Teacher } from './../../../../app/models/teacher';
import { Course } from './../../../../app/models/course';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from './../../../../app/services/socketio.service';
import { Student } from './../../../../app/models/student';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorComponent } from './instructor.component';

class MockActivatedRoute {
  snapshot = {
    params: {
      id: '1234',
    },
  };
}

describe('InstructorComponent', () => {
  let component: InstructorComponent;
  let fixture: ComponentFixture<InstructorComponent>;
  let httpMock: HttpTestingController;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockTeacher: Teacher = {
    _id: '',
    name: '',
    email: '',
    password: '',
    title: '',
    picture: '',
    courses_teaching: [],
    createdAt: '',
    articles_published: [],
    quizzes_published: [],
    likes: 0,
    online: false,
    last_activity: '',
  };
  let mockStudent: Student;
  const mockCourses: Course[] = [
    {
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
      WhatYouWillLearn: [],
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InstructorComponent],
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
      enrolled_courses: [],
      liked_teachers: ['1234'],
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
    fixture = TestBed.createComponent(InstructorComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(
      API_URL + `/api/students/getStudent/${mockStudent.email}`
    );
    req1.flush(mockStudent);
    const req2 = httpMock.expectOne(
      API_URL + `/api/teachers/getTeacherById/${component.id}`
    );
    req2.flush(mockTeacher);
    const req3 = httpMock.expectOne(API_URL + `/api/courses/getCoursesByIds`);
    req3.flush(mockCourses);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createChat()', () => {
    it('should create/join a chat between two users', () => {
      spyOn(component.router, 'navigateByUrl');
      component.createChat();
      const req = httpMock.expectOne(API_URL + '/api/chats/createChat');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        chat: {
          person1_ID: component.account._id,
          person2_ID: component.teacher._id,
          newMessages: 0,
          messages: [],
        },
      });
      req.flush({ message: 'success' });
    });
  });

  describe('isLiked()', () => {
    it('should set liked to true if user already liked the teacher', () => {
      component.isLiked();
      expect(component.liked).toBeTrue();
    });

    it("should set liked to false if user didn't like the teacher before", () => {
      mockStudent.liked_teachers[0] = '';
      component.isLiked();
      expect(component.liked).toBeFalse();
    });
  });

  describe('addLike()', () => {
    it('should add a like to the teacher', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getAccount');
      spyOn(component, 'getInstructor');
      component.addLike();
      const req = httpMock.expectOne(API_URL + '/api/students/likeTeacher');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: component.account.email,
        teacherID: component.id,
      });
      req.flush({ message: 'success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAccount).toHaveBeenCalled();
      expect(component.getInstructor).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.addLike();
      const req = httpMock.expectOne(API_URL + '/api/students/likeTeacher');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: component.account.email,
        teacherID: component.id,
      });
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
