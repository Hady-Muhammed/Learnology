import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';

import { TeacherCreateArticleComponent } from './teacher-create-article.component';

describe('TeacherCreateArticleComponent', () => {
  let component: TeacherCreateArticleComponent;
  let fixture: ComponentFixture<TeacherCreateArticleComponent>;
  let httpMock: HttpTestingController;
  let mockTeacher: Teacher;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TeacherCreateArticleComponent],
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
    fixture = TestBed.createComponent(TeacherCreateArticleComponent);
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
      component.articleContent.setValue('mock');
      component.imageURL.setValue('mock');
      component.title.setValue('mock');
      component.selectedValue = 'mock';
      component.publishArticle();
      const req1 = httpMock.expectOne(API_URL + `/api/articles/publishArticle`);
      expect(req1.request.method).toBe('POST');
      expect(req1.request.body).toEqual({
        author: component.account.name,
        title: component.title.value,
        image: component.imageURL.value,
        postedAt: new Date().toUTCString(),
        category: component.selectedValue,
        body: component.articleContent.value,
      });
      req1.flush(mockTeacher);
      expect(component.toast.success).toHaveBeenCalled();
      const req2 = httpMock.expectOne(
        API_URL + `/api/articles/addArticleToTeacher`
      );
      expect(req2.request.method).toBe('POST');
      req2.flush({ message: 'success' });
      expect(component.router.navigateByUrl).toHaveBeenCalledWith(
        '/teacher/articles'
      );
    });

    it('should tooast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.articleContent.setValue('mock');
      component.imageURL.setValue('mock');
      component.title.setValue('mock');
      component.selectedValue = 'mock';
      component.publishArticle();
      const req1 = httpMock.expectOne(API_URL + `/api/articles/publishArticle`);
      expect(req1.request.method).toBe('POST');
      expect(req1.request.body).toEqual({
        author: component.account.name,
        title: component.title.value,
        image: component.imageURL.value,
        postedAt: new Date().toUTCString(),
        category: component.selectedValue,
        body: component.articleContent.value,
      });
      req1.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });

    it('should toast an error if article\'s data is not valid', () => {
      spyOn(component.toast,'error')
      component.publishArticle()
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('return()', () => {
    it('should go back to the previous page', () => {
      spyOn(window.history,'back')
      component.return()
      expect(history.back).toHaveBeenCalled()
    });
  });
});
