import { routes } from 'src/app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from 'src/app/models/quiz';
import { API_URL } from 'src/app/services/socketio.service';
import { QuestionComponent } from './question.component';
import { Student } from 'src/app/models/student';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let mockActivatedRoute: any;
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
    taken_quizzes: [],
    online: false,
    last_activity: '',
    reacts: [],
    friends: [],
    pendingRequest: false,
    friendRequest: false,
    alreadyFriend: false
  }
  let mockQuiz: Quiz = {
    _id: '10',
    name: '',
    image: '',
    author: {
      name: '',
      id: '',
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
      },
    ],
  };
  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          qnum: 1,
          quizID: 10,
        },
      },
      params: {
        subscribe: () => {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [QuestionComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
    localStorage.setItem("token",token)
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getQuiz()', () => {
    it('should get the quiz of the specified id', () => {
      component.getQuiz(mockQuiz._id);
      const req = httpMock.expectOne(
        API_URL + `/api/quizzes/getSingleQuiz/${component.id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockQuiz);
      expect(component.quiz).toEqual(mockQuiz);
    });
  });

  describe('startTimer()', () => {
    it('should display "Question timeout!" toast message and navigate to the next question when timer reaches 0 and there are more questions', fakeAsync(() => {
      component.questionNo = '1';
      component.quiz = mockQuiz
      spyOn(component.router, 'navigate');
      spyOn(component.toast, 'warning');
      component.timer = 5
      component.startTimer();
      tick(5000); // wait for timer to reach 0
      expect(component.toast.warning).toHaveBeenCalledWith({ detail: 'Question timeout!' });
      expect(component.router.navigate).toHaveBeenCalledWith(['/quiz', component.quiz._id, 2]);
    }));

    // it('should display "Quiz timeout!" toast message and not navigate to the next question when timer reaches 0 and it is the last question', fakeAsync(() => {
    //   component.questionNo = '3';
    //   component.quiz = mockQuiz
    //   spyOn(component.router, 'navigate');
    //   spyOn(component.toast, 'warning');
    //   component.startTimer();
    //   tick(1000); // wait for timer to reach 0
    //   expect(component.toast.warning).toHaveBeenCalledWith({ detail: 'Quiz timeout!' });
    //   expect(component.router.navigate).not.toHaveBeenCalled();
    // }));
  });

  describe('nextQuestion()', () => {
    it('should not go to the next question only if no answer has been selected', () => {
      spyOn(component.toast, 'error');
      component.nextQuestion(component.id, component.questionNo, '');
      expect(component.toast.error).toHaveBeenCalled();
    });

    it('should go to the next question only if answer has been selected', () => {
      spyOn(component.router, 'navigate');
      component.nextQuestion(component.id, component.questionNo, 'mock');
      expect(component.router.navigate).toHaveBeenCalledWith([
        'quiz',
        component.id,
        component.questionNo,
      ]);
    });
  });

  describe('submitQuiz()', () => {
    it('should not submit quiz only if no answer has been selected', () => {
      spyOn(component.toast, 'error');
      component.submitQuiz('');
      expect(component.toast.error).toHaveBeenCalled();
    });

    it('should submit quiz only if answer has been selected', () => {
      spyOn(component, 'correctQuiz');
      component.quiz = mockQuiz
      component.submitQuiz('mock');
      expect(component.correctQuiz).toHaveBeenCalled()
    });
  });

  describe('correctQuiz()', () => {
    it('should rate/correct the finished quiz', () => {
      spyOn(component.router, 'navigate');
      component.quiz = mockQuiz
      component.correctQuiz();
      const req = httpMock.expectOne(API_URL + '/api/quizzes/calculateScore')
      req.flush({message: "success"})
      expect(req.request.method).toBe("POST")
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
});
