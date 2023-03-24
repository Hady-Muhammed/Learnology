import { Student } from './../../../../../app/models/student';
import { API_URL } from './../../../../../app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendCardComponent } from './friend-card.component';

describe('FriendCardComponent', () => {
  let component: FriendCardComponent;
  let fixture: ComponentFixture<FriendCardComponent>;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FriendCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendCardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    let mockAccount: Student = {
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
    };
    let mockFriend: Student = {
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
    };
    component.account = mockAccount;
    component.friend = mockFriend;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeFriend()', () => {
    it("should remove friend from the student's friends list", () => {
      spyOn(component.toast, 'success');
      spyOn(component.friendRemoved, 'emit');
      component.removeFriend();
      const req = httpMock.expectOne(API_URL + '/api/students/removeFriend');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        person1: component.account,
        person2: component.friend,
      });
      req.flush({ message: 'success' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.friendRemoved.emit).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.removeFriend();
      const req = httpMock.expectOne(API_URL + '/api/students/removeFriend');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        person1: component.account,
        person2: component.friend,
      });
      req.error(new ProgressEvent('success'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('messageFriend()', () => {
    it('should join a chat room between the two students', () => {
      spyOn(component.router, 'navigateByUrl');
      component.messageFriend();
      const req = httpMock.expectOne(API_URL + '/api/chats/createChat');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        chat: {
          person1_ID: component.account._id,
          person2_ID: component.friend._id,
          newMessages: 0,
          messages: [],
        },
      });
      req.flush({ message: 'success' });
    });
  });
});
