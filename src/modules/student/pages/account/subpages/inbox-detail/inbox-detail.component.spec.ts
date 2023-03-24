import { ActivatedRoute } from '@angular/router';
import { API_URL } from './../../../../../../app/services/socketio.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxDetailComponent } from './inbox-detail.component';
import { Inbox } from 'src/app/models/inbox';

describe('InboxDetailComponent', () => {
  let component: InboxDetailComponent;
  let fixture: ComponentFixture<InboxDetailComponent>;
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
      declarations: [InboxDetailComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(InboxDetailComponent);
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
      spyOn(window.history,'back')
      component.return()
      expect(history.back).toHaveBeenCalled();
    });
  });

});
