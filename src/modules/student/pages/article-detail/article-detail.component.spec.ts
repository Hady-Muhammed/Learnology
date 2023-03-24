import { RouterTestingModule } from '@angular/router/testing';
import { Article } from 'src/app/models/article';
import { ArticleDetailComponent } from './article-detail.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { API_URL } from 'src/app/services/socketio.service';

describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;
  let httpMock: HttpTestingController;
  let mockArticle: Article;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ArticleDetailComponent],
    }).compileComponents();
    mockArticle = {
      _id: '5',
      author: '',
      title: '',
      image: '',
      postedAt: '',
      category: '',
      body: '',
    };
    fixture = TestBed.createComponent(ArticleDetailComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    const req1 = httpMock.expectOne(
      API_URL + `/api/articles/getArticle/${component.id}`
    );
    req1.flush(mockArticle);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('getArticle()', () => {
    it('should get an article', () => {
      component.getArticle();
      const req = httpMock.expectOne(
        API_URL + `/api/articles/getArticle/${component.id}`
      );
      req.flush(mockArticle);
      expect(component.article).toBe(mockArticle);
    });
  });

  describe('return()', () => {
    it('should return to the previous page', () => {
      spyOn(window.history, 'back');
      component.return();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
