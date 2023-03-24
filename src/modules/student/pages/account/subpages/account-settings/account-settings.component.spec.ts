import { message } from 'src/app/models/chat';
import { routes } from 'src/app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/modules/shared/shared.module';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import {
  AccountSettingsComponent,
  PictureDialog,
} from './account-settings.component';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  let httpMock: HttpTestingController;
  let mockStudent: Student;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [AccountSettingsComponent],
    }).compileComponents();
    localStorage.setItem('token', token);
    mockStudent = {
      _id: '4',
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
    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    const req1 = httpMock.expectOne(
      API_URL + `/api/students/getStudent/${mockStudent.email}`
    );
    req1.flush(mockStudent);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccount()', () => {
    it('should get account of the signed in student from API', () => {
      component.getAccount();
      const req = httpMock.expectOne(
        API_URL + `/api/students/getStudent/${mockStudent.email}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockStudent);
      expect(component.name?.value).toBe(component.account.name);
      expect(component.email?.value).toBe(component.account.email);
      expect(component.email?.disabled).toBeTrue();
    });
  });

  describe('deleteStudent()', () => {
    it('should delete account of the signed in student, toast a success message, remove the token from the localstorage and navigate to signin page', () => {
      spyOn(component.toast, 'success');
      spyOn(component.router, 'navigateByUrl');
      component.deleteStudent();
      const req = httpMock.expectOne(API_URL + `/api/students/deleteStudent`);
      expect(req.request.method).toBe('POST');
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(localStorage.getItem('token')).toBeFalsy();
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.router.navigateByUrl).toHaveBeenCalledWith('/signin');
    });
    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.deleteStudent();
      const req = httpMock.expectOne(API_URL + `/api/students/deleteStudent`);
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent("Error"));
      expect(component.toast.error).toHaveBeenCalled();
    });

  });

  describe('updateAccount()', () => {
    it('should toast an error if form is not valid', () => {
      spyOn(component.toast, 'error');
      component.updateAccount();
      expect(component.toast.error).toHaveBeenCalled();
    });

    it('should update the account of the student', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getAccount');
      component.name?.setValue('mockmockmock');
      component.password?.setValue('mockmockmock');
      component.updateAccount();
      const req = httpMock.expectOne(API_URL + '/api/students/updateStudent');
      expect(req.request.method).toBe('POST');
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAccount).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.name?.setValue('mockmockmock');
      component.password?.setValue('mockmockmock');
      component.updateAccount();
      const req = httpMock.expectOne(API_URL + '/api/students/updateStudent');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('cancelChanges()', () => {
    it('should cancel all changes done to the account information', () => {
      spyOn(component, 'getAccount');
      component.cancelChanges();
      expect(component.getAccount).toHaveBeenCalled();
      expect(component.form.pristine).toBeTrue();
      expect(component.form.dirty).toBeFalse();
    });
  });

  describe('uploadPicture()', () => {
    it('should open the popup input', () => {
      spyOn(component.dialog, 'open');
      component.uploadPicture();
      expect(component.dialog.open).toHaveBeenCalled();
    });
  });
});

describe('PictureDialog', () => {
  let component: PictureDialog;
  let fixture: ComponentFixture<PictureDialog>;
  let httpMock: HttpTestingController;
  let dialogRef: MatDialogRef<PictureDialog>;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(() => {
    localStorage.setItem("token",token)
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [PictureDialog],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
      ],
    });

    fixture = TestBed.createComponent(PictureDialog);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should upload picture and close dialog', () => {
    spyOn(component,'refreshPage')
    const img = 'test-img-url';
    component.Img = img;
    component.uploadPicture();
    const req = httpMock.expectOne(`${API_URL}/api/students/uploadPicture`);
    expect(req.request.method).toBe('POST');
    req.flush({});
    expect(dialogRef.close).toHaveBeenCalled();
    expect(component.refreshPage).toHaveBeenCalled();
  });

  it('should not upload picture if Img is empty', () => {
    component.uploadPicture();
    httpMock.expectNone(`${API_URL}/api/students/uploadPicture`);
    expect(dialogRef.close).not.toHaveBeenCalled()
  });

});
