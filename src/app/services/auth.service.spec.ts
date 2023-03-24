import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { API_URL } from './socketio.service';
import { Teacher } from '../models/teacher';

describe('AuthService', () => {
    let service: AuthService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService]
      });
      service = TestBed.inject(AuthService);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should retrieve teacher from the API via GET', () => {
      const teacherEmail = 'teacher@example.com';
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlYWNoZXJAZXhhbXBsZS5jb20ifQ.1z-Gv1ZtivLiCnKq3HYFblzKm_1yGm0m0w3izufV7ZM';
      localStorage.setItem('token', token);
      const expectedTeacher: Teacher = {
        _id: '',
        name: '',
        email: teacherEmail,
        password: '',
        title: '',
        picture: '',
        courses_teaching: [],
        createdAt: '',
        articles_published: [],
        quizzes_published: [],
        likes: 0,
        online: false,
        last_activity: ''
      } ;
      service.getTeacher().subscribe(
        teacher => expect(teacher).toEqual(expectedTeacher)
      );

      const req = httpTestingController.expectOne(API_URL + `/api/teachers/getTeacher/${teacherEmail}`);
      expect(req.request.method).toEqual('GET');
      req.flush(expectedTeacher);
    });
})
