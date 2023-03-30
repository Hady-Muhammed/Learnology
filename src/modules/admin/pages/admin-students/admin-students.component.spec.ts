import { Student } from './../../../../app/models/student';
import { API_URL } from './../../../../app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStudentsComponent } from './admin-students.component';

describe('AdminStudentsComponent', () => {
  let component: AdminStudentsComponent;
  let fixture: ComponentFixture<AdminStudentsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdminStudentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStudentsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    const req = httpMock.expectOne(API_URL + '/api/students/getAllStudents');
    expect(req.request.method).toBe('GET');
    fixture.detectChanges();
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllStudents()', () => {
    it('should get all students', () => {
      let mockStudents: Student[] = [
        {
          _id: '',
          email: '',
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
        },
      ];
      component.getAllStudents();
      const req = httpMock.expectOne(API_URL + '/api/students/getAllStudents');
      expect(req.request.method).toBe('GET');
      req.flush(mockStudents);
      expect(component.dataSource).toBeTruthy();
    });
  });

  describe('deleteStudentsBySelection()', () => {
    it('should delete a single student and toast a sucess message', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getAllStudents');
      spyOn(component.selection, 'clear');
      component.selection.select([{ email: 'mock' }]);
      component.deleteStudentsBySelection();
      const req = httpMock.expectOne(API_URL + '/api/students/deleteStudent');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: component.selection.selected[0].email,
      });
      req.flush({ message: 'success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAllStudents).toHaveBeenCalled();
      expect(component.selection.clear).toHaveBeenCalled();
    });

    it('should delete multiple students at once and toast a sucess message', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getAllStudents');
      spyOn(component.selection, 'clear');
      component.selection.select([{ email: 'mock1' }, { email: 'mock2' }]);
      component.deleteStudentsBySelection();
      const req = httpMock.expectOne(API_URL + '/api/students/deleteStudent');
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAllStudents).toHaveBeenCalled();
      expect(component.selection.clear).toHaveBeenCalled();
    });

    it('should toast an error when deleting a single student if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.selection.select([{ email: 'mock1' }]);
      component.deleteStudentsBySelection();
      const req = httpMock.expectOne(API_URL + '/api/students/deleteStudent');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error!'));
      expect(component.toast.error).toHaveBeenCalled();
    });

    it('should toast an error when deleting multiple students if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.selection.select(...[
      { email: 'mock1' },
      { email: 'mock2' },
      { email: 'mock2' },
      { email: 'mock2' }
      ]);
      component.deleteStudentsBySelection();
      const req = httpMock.expectOne(
        API_URL + '/api/students/deleteManyStudents'
      );
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error!'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('deleteStudent()', () => {
    it('should delete the student with the given email', () => {
      let mockEmail = "mock@gmail.com,"
      spyOn(component.toast,"success")
      spyOn(component,"getAllStudents")
      component.deleteStudent(mockEmail)
      const req = httpMock.expectOne(API_URL + "/api/students/deleteStudent")
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual({
        email: mockEmail
      })
      req.flush({message: "Success"})
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getAllStudents).toHaveBeenCalled()
    });
  });

});
