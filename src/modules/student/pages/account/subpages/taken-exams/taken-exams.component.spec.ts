import { API_URL } from 'src/app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TakenExamsComponent } from './taken-exams.component';
import { Student } from 'src/app/models/student';
import { Quiz } from 'src/app/models/quiz';

describe('TakenExamsComponent', () => {
  let component: TakenExamsComponent;
  let fixture: ComponentFixture<TakenExamsComponent>;
  let httpMock: HttpTestingController;
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
        score: 'string',
        takenAt: 'string',
      },
      {
        id: '2',
        score: '',
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
  let mockQuizzes: Quiz[] = [
    {
      _id: '1',
      name: '',
      image: '',
      author: {
        name: '',
        id: '',
      },
      publishedAt: '',
      category: '',
      difficulty: '',
      questions: [],
    },
    {
      _id: '2',
      name: '',
      image: '',
      author: {
        name: '',
        id: '',
      },
      publishedAt: '',
      category: '',
      difficulty: '',
      questions: [],
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TakenExamsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TakenExamsComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    // Constructor requests
    const req1 = httpMock.expectOne(
      API_URL + `/api/students/getStudent/${mockStudent.email}`
    );
    req1.flush(mockStudent);
    const req2 = httpMock.expectOne(API_URL + '/api/quizzes/getQuizzesByIds');
    expect(req2.request.body).toEqual({
      quizIDs: ['1', '2'],
    });
    req2.flush(mockQuizzes);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
