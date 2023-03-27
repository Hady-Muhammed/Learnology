import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';
import { TeacherCreateCourseComponent } from './teacher-create-course.component';

describe('TeacherCreateCourseComponent', () => {
  let component: TeacherCreateCourseComponent;
  let fixture: ComponentFixture<TeacherCreateCourseComponent>;
  let httpMock: HttpTestingController;
  let mockTeacher: Teacher;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,ReactiveFormsModule],
      declarations: [TeacherCreateCourseComponent],
    }).compileComponents();
    localStorage.setItem('token', token);
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
    fixture = TestBed.createComponent(TeacherCreateCourseComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    const req1 = httpMock.expectOne(
      API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
    );
    req1.flush(mockTeacher);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccount()', () => {
    it('should get the account of the signed in teacher', () => {
      component.getAccount();
      const req = httpMock.expectOne(
        API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTeacher);
      expect(component.account).toEqual(mockTeacher);
    });
  });

  describe('publishArticle()', () => {
    it('should publish a new article', () => {
      spyOn(component.toast, 'success');
      spyOn(component.router, 'navigateByUrl');
      component.courseCateg.setValue('mock');
      component.courseOverview.setValue('mock');
      component.coursePrice.setValue('mock');
      component.courseTitle.setValue('mock');
      component.courseShortDesc.setValue('mock');
      component.imageURL.setValue('mock');
      component.publishCourse();
      const req = httpMock.expectOne(API_URL + `/api/courses/publishCourse`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        coursee: {
          instructor_name: component.account.name,
          instructor_title: component.account.title,
          course_title: component.courseTitle.value,
          short_desc: component.courseShortDesc.value,
          image: component.imageURL.value,
          postedAt: new Date().toUTCString(),
          num_of_likes: 0,
          rating: [1, 1, 1],
          overview: component.courseOverview.value,
          category: component.courseCateg.value,
          price: component.coursePrice.value,
          WhatYouWillLearn: [],
          videos: [],
        },
        email: component.account.email,
      });
      req.flush({});
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.router.navigateByUrl).toHaveBeenCalledWith(
        '/teacher/courses'
      );
    });

    it('should tooast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.courseCateg.setValue('mock');
      component.courseOverview.setValue('mock');
      component.coursePrice.setValue('mock');
      component.courseTitle.setValue('mock');
      component.courseShortDesc.setValue('mock');
      component.imageURL.setValue('mock');
      console.log(component.form)
      component.publishCourse();
      const req = httpMock.expectOne(API_URL + `/api/courses/publishCourse`);
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent("Error"));
      expect(component.toast.error).toHaveBeenCalled();
    });

    it("should toast an error if article's data is not valid", () => {
      spyOn(component.toast, 'error');
      component.publishCourse();
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('return()', () => {
    it('should go back to the previous page', () => {
      spyOn(window.history, 'back');
      component.return();
      expect(history.back).toHaveBeenCalled();
    });
  });
});
