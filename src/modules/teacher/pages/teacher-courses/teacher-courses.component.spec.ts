import { Course } from './../../../../app/models/course';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';

import { TeacherCoursesComponent } from './teacher-courses.component';

describe('TeacherCoursesComponent', () => {
  let component: TeacherCoursesComponent;
  let fixture: ComponentFixture<TeacherCoursesComponent>;
  let httpMock: HttpTestingController;
  let mockTeacher: Teacher;
  let mockCourses: Course[] = [
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
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TeacherCoursesComponent],
    }).compileComponents();
    mockTeacher = {
      _id: '',
      name: '',
      email: 'test@example.com',
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
    fixture = TestBed.createComponent(TeacherCoursesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    const req1 = httpMock.expectOne(
      API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
    );
    req1.flush(mockTeacher);
    const req2 = httpMock.expectOne(
      API_URL + `/api/courses/getCoursesByIds`
    );
    req2.flush(mockCourses);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteCourse()', () => {
    it('should delete course with the specified id', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getAccount');
      let mockID = '5';
      component.deleteCourse(mockID);
      const req = httpMock.expectOne(API_URL + `/api/courses/deleteCourse`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAccount).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      let mockID = '5';
      component.deleteCourse(mockID);
      const req = httpMock.expectOne(API_URL + `/api/courses/deleteCourse`);
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent("Error"));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
