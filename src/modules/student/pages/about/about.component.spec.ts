import { AboutComponent } from './about.component';
import { Student } from './../../../../app/models/student';
import { API_URL } from './../../../../app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Teacher } from 'src/app/models/teacher';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let httpMock: HttpTestingController;
  let mockStudent: Student;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AboutComponent],
    }).compileComponents();
    mockStudent = {
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
      alreadyFriend: false,
    };
    localStorage.setItem('token', token);
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    const req2 = httpMock.expectOne(API_URL + '/api/teachers/getAllTeachers');
    expect(req2.request.method).toBe('GET');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllTeachers()', () => {
    it('should get all teachers in the application', () => {
      let mockTeachers: Teacher[] = [
        {
          _id: '',
          name: '',
          email: '',
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
        },
      ];
      component.getAllTeachers();
      component.teachers.subscribe();
      const req = httpMock.expectOne(API_URL + `/api/teachers/getAllTeachers`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTeachers);
    });
  });
});
