import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Quiz } from 'src/app/models/quiz';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

import { QuizzesComponent } from './quizzes.component';

describe('QuizzesComponent', () => {
  let component: QuizzesComponent;
  let fixture: ComponentFixture<QuizzesComponent>;
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
  let mockQuizzes: Quiz[]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ QuizzesComponent ]
    })
    .compileComponents();
    mockQuizzes = [
      {
        _id: '1',
        name: 'JavaScript',
        image: '',
        author: {
          name: '',
          id: '',
        },
        publishedAt: '',
        category: '',
        difficulty: 'Easy',
        questions: [],
      },
      {
        _id: '2',
        name: 'Python',
        image: '',
        author: {
          name: '',
          id: '',
        },
        publishedAt: '',
        category: '',
        difficulty: 'Medium',
        questions: [],
      },
      {
        _id: '2',
        name: 'C++',
        image: '',
        author: {
          name: '',
          id: '',
        },
        publishedAt: '',
        category: '',
        difficulty: 'Hard',
        questions: [],
      },
    ];
    fixture = TestBed.createComponent(QuizzesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(API_URL + `/api/quizzes/getAllQuizzes`)
    req1.flush(mockQuizzes)
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeDifficulty()', () => {
    it('should change the difficulty of the displayed exams', fakeAsync(() => {
      component.easy = true
      component.medium = true
      component.hard = true
      component.changeDifficulty()
      expect(component.loading).toBeTrue()
      tick(2000)
      expect(component.loading).toBeFalse()
      expect(component.filteredQuizzes).toEqual(mockQuizzes)
    }));

    it('should display all exams if all difficulties aren\'t selected', fakeAsync(() => {
      component.changeDifficulty()
      expect(component.loading).toBeTrue()
      tick(2000)
      expect(component.loading).toBeFalse()
      expect(component.filteredQuizzes).toEqual(mockQuizzes)
    }))
  });

  describe('searchForQuiz()', () => {
    it('should search for a specific exam', () => {
      component.searchTerm = 'javascript'
      component.quizzes = mockQuizzes
      component.searchForQuiz()
      expect(component.filteredQuizzes.length).toBe(1);
    });
    it('should display all quizzes if search term is null', () => {
      component.searchTerm = ''
      component.searchForQuiz()
      expect(component.filteredQuizzes.length).toBe(3);
    });

  });

});
