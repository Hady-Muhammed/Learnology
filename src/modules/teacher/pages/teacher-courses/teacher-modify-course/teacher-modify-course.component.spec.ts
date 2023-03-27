import { ReactiveFormsModule } from '@angular/forms';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';
import { ActivatedRoute } from '@angular/router';
import { TeacherModifyCourseComponent } from './teacher-modify-course.component';
import { Course } from 'src/app/models/course';

describe('TeacherModifyCourseComponent', () => {
  let component: TeacherModifyCourseComponent;
  let fixture: ComponentFixture<TeacherModifyCourseComponent>;
  let httpMock: HttpTestingController;
  let mockActivatedRoute: any;
  let mockTeacher: Teacher;
  let mockCourse: Course;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          id: '123',
        },
      },
      params: {
        subscribe: () => {},
      },
    };
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [TeacherModifyCourseComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
    localStorage.setItem('token', token);
    mockCourse = {
      _id: '123',
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
    };
    mockTeacher = {
      _id: '',
      name: '',
      email: 'test@example.com',
      password: '',
      title: '',
      picture: '',
      courses_teaching: ['123'],
      createdAt: '',
      articles_published: [],
      quizzes_published: [],
      likes: 0,
      online: false,
      last_activity: '',
    };
    fixture = TestBed.createComponent(TeacherModifyCourseComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(
      API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
    );
    req1.flush(mockTeacher);
    const req2 = httpMock.expectOne(
      API_URL + `/api/courses/getCourse/${mockCourse._id}`
    );
    req2.flush(mockCourse);
    const req3 = httpMock.expectOne(API_URL + '/api/students/getStudentsByIds');
    req3.flush(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('return()', () => {
    it('should go back to the previous page', () => {
      spyOn(window.history, 'back');
      component.return();
      expect(history.back).toHaveBeenCalled();
    });
  });

  describe('getOriginalData()', () => {
    it('should set the original data of the course to the form', () => {
      spyOn(component, 'addOldPoints');
      mockCourse.WhatYouWillLearn = ['x','y','z']
      component.getOriginalData(mockCourse);
      expect(component.courseCateg.value).toBe(mockCourse.category);
      expect(component.courseOverview.value).toBe(mockCourse.overview);
      expect(component.coursePostedAt.value).toBe(mockCourse.postedAt);
      expect(component.coursePrice.value).toBe(mockCourse.price);
      expect(component.courseShortDesc.value).toBe(mockCourse.short_desc);
      expect(component.addOldPoints).toHaveBeenCalledTimes(
        mockCourse.WhatYouWillLearn.length
      );
    });
  });

  describe('addOldPoints()', () => {
    it('should add all points of what you will learn to a list to display it', () => {
      let mockPoint = 'x';
      component.addOldPoints(mockPoint);
      expect(
        component.WhatYouWillLearn.value.map((x: any) => x.point === mockPoint)
          .length
      ).toBe(1);
    });
  });

  describe('point()', () => {
    it('should return the converted point from string to form group format', () => {
      let mockPoint = 'x';
      component.addOldPoints(mockPoint);
      expect(
        component.WhatYouWillLearn.value.map((x: any) => x.point === mockPoint)
          .length
      ).toBe(1);
    });
  });

  describe('addNewPoint()', () => {
    it('should add a new empty point', () => {
      component.addNewPoint();
      expect(component.WhatYouWillLearn.value.length).toBe(1);
    });
  });

  describe('deletePoint()', () => {
    it('should delete point with a specified index', () => {
      spyOn(component.WhatYouWillLearn, 'markAsTouched');
      let mockPoint1 = 'x';
      let mockPoint2 = 'y';
      component.addOldPoints(mockPoint1);
      component.addOldPoints(mockPoint2);
      component.deletePoint(0);
      expect(component.WhatYouWillLearn.value.length).toBe(1);
      expect(component.WhatYouWillLearn.markAsTouched).toHaveBeenCalled();
    });
  });

  describe('cancelChanges()', () => {
    it('should cancel all changes made', () => {
      spyOn(component.WhatYouWillLearn, 'clear');
      spyOn(component, 'getOriginalData');
      component.courseCateg.setValue('mock');
      component.cancelChanges();
      expect(component.form.pristine).toBe(true);
      expect(component.getOriginalData).toHaveBeenCalled();
      expect(component.WhatYouWillLearn.clear).toHaveBeenCalled();
    });
  });

  describe('createChat()', () => {
    it('should create/join chat between student and a teacher', () => {
      spyOn(component.router, 'navigateByUrl');
      component.createChat(mockTeacher._id);
      const req = httpMock.expectOne(API_URL + `/api/chats/createChat`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        chat: {
          person1_ID: component.account._id,
          person2_ID: mockTeacher._id,
          newMessages: 0,
          messages: [],
        },
      });
      let mockRespone = { id: '1234' };
      req.flush(mockRespone);
      expect(component.router.navigateByUrl).toHaveBeenCalledWith(
        `/teacher/t/messages/${mockRespone.id}`
      );
    });
  });

  describe('saveChanges()', () => {
    it('should modify the article', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'return');
      component.saveChanges();
      const req = httpMock.expectOne(API_URL + `/api/courses/modifyCourse`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.return).toHaveBeenCalled();
    });
    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.saveChanges();
      const req = httpMock.expectOne(API_URL + `/api/courses/modifyCourse`);
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
