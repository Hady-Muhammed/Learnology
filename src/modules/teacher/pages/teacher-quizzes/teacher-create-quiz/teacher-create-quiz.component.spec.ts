import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';
import { TeacherCreateQuizComponent } from './teacher-create-quiz.component';

describe('TeacherCreateQuizComponent', () => {
  let component: TeacherCreateQuizComponent;
  let fixture: ComponentFixture<TeacherCreateQuizComponent>;
  let httpMock: HttpTestingController;
  let mockTeacher: Teacher;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TeacherCreateQuizComponent],
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
    fixture = TestBed.createComponent(TeacherCreateQuizComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    const req1 = httpMock.expectOne(
      API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
    );
    req1.flush(mockTeacher);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccount()', () => {
    it('should get the account of the signed in teacher', () => {
      component.getAccount();
      const req = httpMock.expectOne(
        API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTeacher);
      expect(component.account).toEqual(mockTeacher);
    });
  });

  describe('postQuiz()', () => {
    it('should post a new quiz', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'return');
      component.category?.setValue('mock');
      component.imageURL?.setValue('mock');
      component.name?.setValue('mock');
      component.selectedValue?.setValue('mock');
      component.postQuiz();
      const req1 = httpMock.expectOne(API_URL + `/api/quizzes/createQuiz`);
      expect(req1.request.method).toBe('POST');
      expect(req1.request.body).toEqual({
        quizz: {
          name: component.name?.value,
          image: component.imageURL?.value,
          author: {
            name: component.account?.name,
            id: component.account?._id,
          },
          publishedAt: new Date().toUTCString(),
          category: component.category?.value,
          difficulty: component.selectedValue?.value,
          questions: [],
        }
      });
      req1.flush({message:"success"});
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.return).toHaveBeenCalled();
    });

    it('should tooast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.category?.setValue('mock');
      component.imageURL?.setValue('mock');
      component.name?.setValue('mock');
      component.selectedValue?.setValue('mock');
      component.postQuiz();
      const req1 = httpMock.expectOne(API_URL + `/api/quizzes/createQuiz`);
      expect(req1.request.method).toBe('POST');
      req1.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });

    it('should toast an error if quiz\'s data is not valid', () => {
      spyOn(component.toast,'error')
      component.postQuiz()
      expect(component.toast.error).toHaveBeenCalled()
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
