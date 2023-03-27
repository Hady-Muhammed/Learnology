import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { API_URL } from './../../../../app/services/socketio.service';
import { Article } from './../../../../app/models/article';
import { Teacher } from './../../../../app/models/teacher';
import { TeacherArticlesComponent } from './teacher-articles.component';

describe('TeacherArticlesComponent', () => {
  let component: TeacherArticlesComponent;
  let fixture: ComponentFixture<TeacherArticlesComponent>;
  let httpMock: HttpTestingController;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  const mockArticles: Article[] = [
    {
      _id: '',
      author: '',
      title: '',
      image: '',
      postedAt: '',
      category: '',
      body: '',
    },
  ];
  let mockTeacher: Teacher = {
    email: 'test@example.com',
    articles_published: [],
    _id: '',
    name: '',
    password: '',
    title: '',
    picture: '',
    courses_teaching: [],
    createdAt: '',
    quizzes_published: [],
    likes: 0,
    online: false,
    last_activity: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherArticlesComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
    localStorage.setItem('token', token);
    fixture = TestBed.createComponent(TeacherArticlesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(
      API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
    );
    req1.flush(mockTeacher);
    const req2 = httpMock.expectOne(
      API_URL + '/api/articles/getArticlesByIds'
    );
    req2.flush(mockArticles)
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAccount()', () => {
    it('should get the account of the signed in teacher', () => {
      spyOn(component,'getArticles')
      component.getAccount();
      const req = httpMock.expectOne(
        API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTeacher);
      expect(component.getArticles).toHaveBeenCalled()
    });
  });

  describe('getArticles()', () => {
    it('should get articles published by the teacher', () => {
      component.getArticles(mockTeacher.articles_published);
      const req = httpMock.expectOne(
        API_URL + '/api/articles/getArticlesByIds'
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockArticles)
      expect(component.articles).toBe(mockArticles)
    });
  });

  describe('deleteArticle()', () => {
    it('should delete an article with the specified id', () => {
      spyOn(component.toast,'success')
      spyOn(component,'getAccount')
      let mockID = '5'
      component.deleteArticle(mockID);
      const req = httpMock.expectOne(
        API_URL + '/api/articles/deleteArticle'
      );
      expect(req.request.method).toBe('POST');
      req.flush({message: 'success'})
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getAccount).toHaveBeenCalled()
    });
    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      let mockID = '5'
      component.deleteArticle(mockID);
      const req = httpMock.expectOne(
        API_URL + '/api/articles/deleteArticle'
      );
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });
  });
});
