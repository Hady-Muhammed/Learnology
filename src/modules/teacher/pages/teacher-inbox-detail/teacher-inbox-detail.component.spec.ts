import { ActivatedRoute } from '@angular/router';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inbox } from 'src/app/models/inbox';
import { TeacherInboxDetailComponent } from './teacher-inbox-detail.component';
import { API_URL } from 'src/app/services/socketio.service';

describe('TeacherInboxDetailComponent', () => {
  let component: TeacherInboxDetailComponent;
  let fixture: ComponentFixture<TeacherInboxDetailComponent>;
  let httpMock: HttpTestingController;
  let mockActivatedRoute: any;
  let mockInboxes: Inbox[] = [
    {
      _id: '',
      to: '',
      subject: '',
      sentAt: '',
      body: '',
      read: false,
    },
  ];
  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          id: 1,
        },
      },
      params: {
        subscribe: () => {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TeacherInboxDetailComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TeacherInboxDetailComponent);
    component = fixture.componentInstance;
    const req = httpMock.expectOne(
      API_URL + `/api/inboxes/getInbox/${component.id}`
    );
    req.flush(mockInboxes);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('return()', () => {
    it('should return to the previous page', () => {
      spyOn(window.history, 'back');
      component.return();
      expect(history.back).toHaveBeenCalled();
    });
  });
});
