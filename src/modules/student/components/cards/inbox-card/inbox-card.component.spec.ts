import { Inbox } from './../../../../../app/models/inbox';
import { InboxCardComponent } from './inbox-card.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_URL } from 'src/app/services/socketio.service';

describe('InboxCardComponent', () => {
  let component: InboxCardComponent;
  let fixture: ComponentFixture<InboxCardComponent>;
  let httpMock: HttpTestingController;
  let mockInbox: Inbox;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InboxCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InboxCardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    mockInbox = {
      _id: '',
      to: '',
      subject: '',
      sentAt: '',
      body: '',
      read: false,
    };
    component.inbox = mockInbox;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inboxRead()', () => {
    it('should mark inbox as read', () => {
      component.inboxRead(mockInbox);
      const req = httpMock.expectOne(API_URL + '/api/inboxes/inboxRead');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        id: mockInbox._id,
      });
      req.flush({ message: 'success' });
    });
  });

  describe('deleteInbox()', () => {
    it('should delete an inbox', () => {
      spyOn(component.inboxDeleted, 'emit');
      spyOn(component.toast, 'success');
      component.deleteInbox(mockInbox._id);
      const req = httpMock.expectOne(
        API_URL + `/api/inboxes/deleteInbox/${mockInbox._id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'success' });
      expect(component.inboxDeleted.emit).toHaveBeenCalled();
      expect(component.toast.success).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.deleteInbox(mockInbox._id);
      const req = httpMock.expectOne(
        API_URL + `/api/inboxes/deleteInbox/${mockInbox._id}`
      );
      expect(req.request.method).toBe('DELETE');
      req.error(new ProgressEvent('error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
