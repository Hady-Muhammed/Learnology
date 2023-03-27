import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';
import { TeacherQuizzesComponent } from './teacher-quizzes.component';

describe('TeacherQuizzesComponent', () => {
  let component: TeacherQuizzesComponent;
  let fixture: ComponentFixture<TeacherQuizzesComponent>;
  let httpMock: HttpTestingController;
  let mockTeacher: Teacher;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TeacherQuizzesComponent],
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
    fixture = TestBed.createComponent(TeacherQuizzesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    const req1 = httpMock.expectOne(
      API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
    );
    req1.flush(mockTeacher);
    const req2 = httpMock.expectOne(
      API_URL + `/api/quizzes/getTeacherQuizzes/${mockTeacher._id}`
    );
    req2.flush(null);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteQuiz()', () => {
    it('should delete a quiz with the specified id', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getQuizzes');
      let mockID = '5'
      component.deleteQuiz(mockID)
      const req = httpMock.expectOne(API_URL + `/api/quizzes/deleteQuiz`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'succes' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getQuizzes).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      let mockID = '5'
      component.deleteQuiz(mockID)
      const req = httpMock.expectOne(API_URL + `/api/quizzes/deleteQuiz`);
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
