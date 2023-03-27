import { ActivatedRoute } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizResultsComponent } from './quiz-results.component';
import { API_URL } from 'src/app/services/socketio.service';
import { Student } from 'src/app/models/student';

describe('QuizResultsComponent', () => {
  let component: QuizResultsComponent;
  let fixture: ComponentFixture<QuizResultsComponent>;
  let httpMock: HttpTestingController;
  let mockActivatedRoute: any;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockStudent: Student = {
    _id: '',
    email: 'test@example.com',
    name: '',
    picture: '',
    password: '',
    createdAt: '',
    enrolled_courses: [],
    liked_teachers: [],
    taken_quizzes: [
      {
        id: '1',
        score: '5/10',
        takenAt: '',
      },
    ],
    online: false,
    last_activity: '',
    reacts: [],
    friends: [],
    pendingRequest: false,
    friendRequest: false,
    alreadyFriend: false,
  };
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
      declarations: [QuizResultsComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
    localStorage.setItem('token', token);
    fixture = TestBed.createComponent(QuizResultsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(
      API_URL + `/api/students/getStudent/${mockStudent.email}`
    );
    req1.flush(mockStudent);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify()
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getScore()', () => {
    it('should get the score of a quiz', () => {
      component.getScore()
      const req = httpMock.expectOne(
        API_URL + `/api/students/getStudent/${mockStudent.email}`
      );
      expect(req.request.method).toBe("GET")
      req.flush(mockStudent);
      expect(component.percentage).toBe('50.0%');
    });
  });

});
