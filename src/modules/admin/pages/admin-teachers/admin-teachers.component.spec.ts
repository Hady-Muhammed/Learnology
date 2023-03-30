import { Teacher } from './../../../../app/models/teacher';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTeachersComponent } from './admin-teachers.component';
import { API_URL } from 'src/app/services/socketio.service';

describe('AdminTeachersComponent', () => {
  let component: AdminTeachersComponent;
  let fixture: ComponentFixture<AdminTeachersComponent>;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdminTeachersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTeachersComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    const req = httpMock.expectOne(API_URL + '/api/teachers/getAllTeachers');
    expect(req.request.method).toBe('GET');
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllTeachers()', () => {
    it('should get all teachers', () => {
      let mockTeachers: Teacher[] = [{
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
        last_activity: ''
      }]
      component.getAllTeachers();
      const req = httpMock.expectOne(API_URL + '/api/teachers/getAllTeachers');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeachers);
      expect(component.dataSource).toBeTruthy();
    });
  });

  describe('deleteTeachersBySelection()', () => {
    it('should delete a single teacher and toast a sucess message', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getAllTeachers');
      spyOn(component.selection, 'clear');
      component.selection.select([{ email: 'mock' }]);
      component.deleteTeachersBySelection();
      const req = httpMock.expectOne(API_URL + '/api/teachers/deleteTeacher');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: component.selection.selected[0].email,
      });
      req.flush({ message: 'success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAllTeachers).toHaveBeenCalled();
      expect(component.selection.clear).toHaveBeenCalled();
    });

    it('should delete multiple teachers at once and toast a sucess message', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getAllTeachers');
      spyOn(component.selection, 'clear');
      component.selection.select([{ email: 'mock1' }, { email: 'mock2' }]);
      component.deleteTeachersBySelection();
      const req = httpMock.expectOne(API_URL + '/api/teachers/deleteTeacher');
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAllTeachers).toHaveBeenCalled();
      expect(component.selection.clear).toHaveBeenCalled();
    });

    it('should toast an error when deleting a single teacher if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.selection.select([{ email: 'mock1' }]);
      component.deleteTeachersBySelection();
      const req = httpMock.expectOne(API_URL + '/api/teachers/deleteTeacher');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error!'));
      expect(component.toast.error).toHaveBeenCalled();
    });

    it('should toast an error when deleting multiple teachers if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.selection.select(
        ...[
          { email: 'mock1' },
          { email: 'mock2' },
          { email: 'mock2' },
          { email: 'mock2' },
        ]
      );
      component.deleteTeachersBySelection();
      const req = httpMock.expectOne(
        API_URL + '/api/teachers/deleteManyTeachers'
      );
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error!'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('deleteTeacher()', () => {
    it('should delete the teacher with the given email', () => {
      let mockEmail = 'mock@gmail.com,';
      spyOn(component.toast, 'success');
      spyOn(component, 'getAllTeachers');
      component.deleteTeacher(mockEmail);
      const req = httpMock.expectOne(API_URL + '/api/teachers/deleteTeacher');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: mockEmail,
      });
      req.flush({ message: 'Success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAllTeachers).toHaveBeenCalled();
    });
  });
});
