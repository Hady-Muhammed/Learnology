import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Quiz, question } from 'src/app/models/quiz';
import { ReactiveFormsModule } from '@angular/forms';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';
import { ActivatedRoute } from '@angular/router';
import { TeacherModifyQuizComponent } from './teacher-modify-quiz.component';
import { MaterialModule } from 'src/modules/material/material.module';

describe('TeacherModifyQuizComponent', () => {
  let component: TeacherModifyQuizComponent;
  let fixture: ComponentFixture<TeacherModifyQuizComponent>;
  let httpMock: HttpTestingController;
  let mockActivatedRoute: any;
  let mockTeacher: Teacher;
  let mockQuiz: Quiz;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          id: '123',
        },
      },
      params: {
        subscribe: () => {},
      },
    };
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      declarations: [TeacherModifyQuizComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
    localStorage.setItem('token', token);
    mockQuiz = {
      _id: '',
      name: '',
      image: '',
      author: {
        name: '',
        id: '',
      },
      publishedAt: '',
      category: '',
      difficulty: 'easy',
      questions: [
        {
          head: 'a',
          correctAnswer: '',
          answers: [],
          solving_time: '',
        },
        {
          head: 'b',
          correctAnswer: '',
          answers: [],
          solving_time: '',
        },
      ],
    };
    mockTeacher = {
      _id: '',
      name: '',
      email: 'test@example.com',
      password: '',
      title: '',
      picture: '',
      courses_teaching: ['123'],
      createdAt: '',
      articles_published: [],
      quizzes_published: [],
      likes: 0,
      online: false,
      last_activity: '',
    };
    fixture = TestBed.createComponent(TeacherModifyQuizComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(
      API_URL + `/api/quizzes/getSingleQuiz/${component.id}`
    );
    req1.flush(mockQuiz);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('return()', () => {
    it('should go back to the previous page', () => {
      spyOn(window.history, 'back');
      component.return();
      expect(history.back).toHaveBeenCalled();
    });
  });

  describe('getOriginalData()', () => {
    it('should set the original data of the quiz to the form', () => {
      spyOn(component, 'addOldQuestions');
      component.getOriginalData(mockQuiz);
      expect(component.category?.value).toBe(mockQuiz.category);
      expect(component.imageURL?.value).toBe(mockQuiz.image);
      expect(component.name?.value).toBe(mockQuiz.name);
      expect(component.selectedValue?.value).toBe(mockQuiz.difficulty);
      expect(component.addOldQuestions).toHaveBeenCalledTimes(
        mockQuiz.questions.length
      );
    });
  });

  describe('editQuestion()', () => {
    it('should open the question to be edited with a specified index', () => {
      component.open = 0
      component.editQuestion(1)
      expect(component.open).toBe(1)
    });

    it('should close the question if clicked on it and its already opened', () => {
      component.open = 1
      component.editQuestion(1)
      expect(component.open).toBe(99999)
    });
  });

  describe('addNewQuestion()', () => {
    it('should add a new empty question', () => {
      let oldQuestionsLength = component.questions.controls.length
      component.addNewQuestion();
      expect(component.clicked).toBeTrue()
      expect(component.questions.controls.length).toBe(oldQuestionsLength + 1)
    });
  });

  describe('deleteQuestion()', () => {
    it('should delete question with a specified index', () => {
      let mockQuestion1: question = {
        head: 'x',
        correctAnswer: '',
        answers: [],
        solving_time: '',
      };
      let mockQuestion2: question = {
        head: 'y',
        correctAnswer: '',
        answers: [],
        solving_time: '',
      };
      component.addOldQuestions(mockQuestion1);
      component.addOldQuestions(mockQuestion2);
      component.deleteQuestion(0);
      expect(component.questions.value.length).toBe(3);
      expect(component.clicked).toBeTrue();
    });
  });

  describe('cancelChanges()', () => {
    it('should cancel all changes made', () => {
      spyOn(component.questions, 'clear');
      spyOn(component, 'getQuiz');
      component.cancelChanges();
      expect(component.form.pristine).toBe(true);
      expect(component.getQuiz).toHaveBeenCalled();
      expect(component.questions.clear).toHaveBeenCalled();
      expect(component.clicked).toBeFalse();
    });
  });

  describe('saveChanges()', () => {
    it('should modify the article', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'return');
      component.saveChanges();
      const req = httpMock.expectOne(API_URL + '/api/quizzes/updateQuiz');
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.return).toHaveBeenCalled();
    });
    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.saveChanges();
      const req = httpMock.expectOne(API_URL + '/api/quizzes/updateQuiz');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
