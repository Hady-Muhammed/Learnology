import { BlogComponent } from './blog.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Article } from 'src/app/models/article';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { API_URL } from 'src/app/services/socketio.service';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;
  let httpMock: HttpTestingController;
  let mockArticles: Article[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [BlogComponent],
    }).compileComponents();
    mockArticles = [
      {
        _id: '5',
        author: '',
        title: '',
        image: '',
        postedAt: '',
        category: 'X',
        body: '',
      },
      {
        _id: '5',
        author: '',
        title: '',
        image: '',
        postedAt: '',
        category: 'Y',
        body: '',
      },
    ];
    fixture = TestBed.createComponent(BlogComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    const req1 = httpMock.expectOne(API_URL + `/api/articles/getAllArticles`);
    req1.flush(mockArticles);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllArticles()', () => {
    it('should get all articles published', () => {
      component.getAllArticles();
      const req = httpMock.expectOne(API_URL + `/api/articles/getAllArticles`);
      req.flush(mockArticles);
      expect(component.articles).toBe(mockArticles);
    });
  });

  describe('changeCategory()', () => {
    it('should change/filter the category of the articles', () => {
      const event = { target: { innerText: 'X' } };
      component.changeCategory(event);

      expect(component.category).toEqual('X');
      expect(component.filteredArticles).toEqual([
        {
          _id: '5',
          author: '',
          title: '',
          image: '',
          postedAt: '',
          category: 'X',
          body: '',
        },
      ]);
    });
  });
});
