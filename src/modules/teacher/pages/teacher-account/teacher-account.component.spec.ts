import { Teacher } from './../../../../app/models/teacher';
import { routes } from 'src/app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/modules/shared/shared.module';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_URL } from 'src/app/services/socketio.service';
import { MatDialogRef } from '@angular/material/dialog';
import {
  TeacherAccountComponent,
  PictureDialog,
} from './teacher-account.component';

describe('TeacherAccountComponent', () => {
  let component: TeacherAccountComponent;
  let fixture: ComponentFixture<TeacherAccountComponent>;
  let httpMock: HttpTestingController;
  let mockTeacher: Teacher;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [TeacherAccountComponent],
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
    fixture = TestBed.createComponent(TeacherAccountComponent);
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
    it('should get account of the signed in student from API', () => {
      component.getAccount();
      const req = httpMock.expectOne(
        API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTeacher);
      expect(component.name?.value).toBe(component.account.name);
      expect(component.email?.value).toBe(component.account.email);
      expect(component.email?.disabled).toBeTrue();
    });
  });

  describe('deleteTeacher()', () => {
    it('should delete account of the signed in teacher, toast a success message, remove the token from the localstorage and navigate to signin page', () => {
      spyOn(component.toast, 'success');
      spyOn(component.router, 'navigateByUrl');
      component.deleteTeacher();
      const req = httpMock.expectOne(API_URL + `/api/teachers/deleteTeacher`);
      expect(req.request.method).toBe('POST');
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(localStorage.getItem('token')).toBeFalsy();
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.router.navigateByUrl).toHaveBeenCalledWith('/signin');
    });
    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.deleteTeacher();
      const req = httpMock.expectOne(API_URL + `/api/teachers/deleteTeacher`);
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('updateTeacher()', () => {
    it('should toast an error if form is not valid', () => {
      spyOn(component.toast, 'error');
      component.updateTeacher();
      expect(component.toast.error).toHaveBeenCalled();
    });

    it('should update the account of the student', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getAccount');
      component.name?.setValue('mockmockmock');
      component.password?.setValue('mockmockmock');
      component.email?.setValue('mockmockmock');
      component.title?.setValue('mockmockmock');
      component.updateTeacher();
      const req = httpMock.expectOne(API_URL + '/api/teachers/updateTeacher');
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
      component.email?.setValue('mockmockmock');
      component.title?.setValue('mockmockmock');
      component.updateTeacher();
      const req = httpMock.expectOne(API_URL + '/api/teachers/updateTeacher');
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
    const req = httpMock.expectOne(`${API_URL}/api/teachers/uploadPicture`);
    expect(req.request.method).toBe('POST');
    req.flush({});
    expect(dialogRef.close).toHaveBeenCalled();
    expect(component.refreshPage).toHaveBeenCalled();
  });

  it('should not upload picture if Img is empty', () => {
    component.uploadPicture();
    httpMock.expectNone(`${API_URL}/api/teachers/uploadPicture`);
    expect(dialogRef.close).not.toHaveBeenCalled()
  });

});
