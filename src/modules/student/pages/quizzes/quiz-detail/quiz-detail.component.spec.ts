import { Quiz } from 'src/app/models/quiz';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

import { QuizDetailComponent } from './quiz-detail.component';
import { ActivatedRoute } from '@angular/router';

describe('QuizDetailComponent', () => {
  let component: QuizDetailComponent;
  let fixture: ComponentFixture<QuizDetailComponent>;
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
    taken_quizzes: [{
      id: '1',
      score: '',
      takenAt: '',
    }],
    online: false,
    last_activity: '',
    reacts: [],
    friends: [],
    pendingRequest: false,
    friendRequest: false,
    alreadyFriend: false
  }
  let mockQuiz: Quiz = {
    _id: '1',
    name: '',
    image: '',
    author: {
      name: '',
      id: ''
    },
    publishedAt: '',
    category: '',
    difficulty: '',
    questions: [
      {
        head: '',
        correctAnswer: '',
        answers: [''],
        solving_time: '00:30',
      },
      {
        head: '',
        correctAnswer: '',
        answers: [''],
        solving_time: '1:00',
      }
    ]
  }

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          id: 1
        }
      },
      params: {
          subscribe: () => {},
        },
    };
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ QuizDetailComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();
    localStorage.setItem("token",token)
    fixture = TestBed.createComponent(QuizDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(API_URL + `/api/quizzes/getSingleQuiz/${component.id}`)
    req1.flush(mockQuiz)
    const req2 = httpMock.expectOne(API_URL + `/api/students/getStudent/${mockStudent.email}`)
    req2.flush(mockStudent)
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('takeQuiz()', () => {
    it('should take the quiz', () => {
      component.takeQuiz()
      const req = httpMock.expectOne(API_URL + `/api/students/takeQuiz`)
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual({
        email: mockStudent.email,
        quizID: component.id,
      })
      req.flush(null)
    });
  });

  describe('getQuiz()', () => {
    it('should get the quiz of specified id', () => {
      spyOn(component,'calcTotalTimeOfQuiz')
      component.getQuiz(mockQuiz._id)
      const req = httpMock.expectOne(API_URL + `/api/quizzes/getSingleQuiz/${component.id}`)
      req.flush(mockQuiz)
      expect(component.calcTotalTimeOfQuiz).toHaveBeenCalled()
      expect(component.quiz).toBe(mockQuiz)
    });
  });

  describe('calcTotalTimeOfQuiz()', () => {
    it('should calculate the total time of specified quiz', () => {
      let totalTime = component.calcTotalTimeOfQuiz(mockQuiz.questions)
      expect(totalTime).toBe(90)
    });
  });

  describe('quizWasTakenBefore()', () => {
    it('should check if quiz was taken before', () => {
      component.quizWasTakenBefore()
      const req = httpMock.expectOne(API_URL + `/api/students/getStudent/${mockStudent.email}`)
      req.flush(mockStudent)
      expect(component.taken).toBeTrue()
    });
  });


});
