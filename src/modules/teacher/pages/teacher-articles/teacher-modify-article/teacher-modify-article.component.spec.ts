import { Article } from './../../../../../app/models/article';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';

import { TeacherModifyArticleComponent } from './teacher-modify-article.component';
import { ActivatedRoute } from '@angular/router';

describe('TeacherModifyArticleComponent', () => {
  let component: TeacherModifyArticleComponent;
  let fixture: ComponentFixture<TeacherModifyArticleComponent>;
  let httpMock: HttpTestingController;
  let mockActivatedRoute: any;
  let mockTeacher: Teacher;
  let mockArticle: Article = {
    _id: '',
    author: '',
    title: '',
    image: '',
    postedAt: '',
    category: '',
    body: '',
  };
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          id: 1,
        },
      },
      params: {
        subscribe: () => {},
      },
    };
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TeacherModifyArticleComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
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
    fixture = TestBed.createComponent(TeacherModifyArticleComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    const req1 = httpMock.expectOne(
      API_URL + `/api/articles/getArticle/${component.id}`
    );
    req1.flush(mockArticle);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('modifyArticle', () => {
    it('should modify the article', () => {
      spyOn(component.toast,'success')
      spyOn(component.router,'navigateByUrl')
      component.modifyArticle()
      const req = httpMock.expectOne(
        API_URL + `/api/articles/modifyArticle`
      );
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual({
        id: component.id,
        modifiedArticle: {
          title: component.title?.value,
          image: component.imageURL?.value,
          body: component.articleContent?.value,
          category: component.selectedValue?.value,
        },
      })
      req.flush({message: "success"});
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.router.navigateByUrl).toHaveBeenCalledWith('/teacher/articles')
    });
    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      component.modifyArticle()
      const req = httpMock.expectOne(
        API_URL + `/api/articles/modifyArticle`
      );
      expect(req.request.method).toBe("POST")
      req.error(new ProgressEvent("error"));
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('cancelChanges()', () => {
    it('should cancel all changes made', () => {
      spyOn(component,'getArticle')
      component.cancelChanges()
      expect(component.getArticle).toHaveBeenCalled()
      expect(component.form.pristine).toBeTrue()
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
