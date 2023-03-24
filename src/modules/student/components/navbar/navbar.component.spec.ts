import { SharedModule } from 'src/modules/shared/shared.module';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { Student } from 'src/app/models/student';

import { NavbarComponent } from './navbar.component';
import { Notification } from 'src/app/models/notification';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockStudent: Student;
  let httpMock: HttpTestingController;
  let socketService: SocketioService;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [NavbarComponent],
    }).compileComponents();
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
    localStorage.setItem('token', token);
    fixture = TestBed.createComponent(NavbarComponent);
    httpMock = TestBed.inject(HttpTestingController);
    socketService = TestBed.inject(SocketioService);
    // Constructor requests
    const req = httpMock.expectOne(
      API_URL + `/api/students/getStudent/${mockStudent.email}`
    );
    req.flush(mockStudent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccount()', () => {
    it('should get account details from API', () => {
      component.getAccount();
      const req1 = httpMock.expectOne(
        API_URL + `/api/students/getStudent/${mockStudent.email}`
      );
      req1.flush(mockStudent);
      expect(component.account).toEqual(mockStudent);
    });
  });

  // describe('listenForNewNotifications()', () => {
  //   it('should increment number of notifications if email matches for someone-commented', () => {
  //     component.account.email = 'test@example.com';
  //     socketService.socket.on.withArgs('listen-someone-commented').and.callFake((event: any, callback: Function) => {
  //       callback('test@example.com');
  //     });

  //     component.listenForNewNotifications();
  //     expect(component.numOfNotifications).toBe(1);
  //   });

  //   it('should increment number of notifications if email matches for someone-replied', () => {
  //     component.account.email = 'test@example.com';
  //     socketService.socket.on.withArgs('listen-someone-replied').and.callFake((event: any, callback: Function) => {
  //       callback('test@example.com');
  //     });

  //     component.listenForNewNotifications();
  //     expect(component.numOfNotifications).toBe(1);
  //   });

  //   it('should increment number of notifications if email matches for someone-reacted', () => {
  //     component.account.email = 'test@example.com';
  //     socketService.socket.on.withArgs('listen-someone-reacted').and.callFake((event: any, callback: Function) => {
  //       callback('test@example.com');
  //     });

  //     component.listenForNewNotifications();
  //     expect(component.numOfNotifications).toBe(1);
  //   });
  // });

  describe('connectToSocket()', () => {
    it('should connect to the web socket', () => {
      spyOn(component.socketService, 'setupSocketConnection');
      spyOn(component.socketService, 'online');
      component.connectToSocket();
      expect(component.socketService.setupSocketConnection).toHaveBeenCalled();
      expect(component.socketService.online).toHaveBeenCalled();
    });

    it('should not connect to the web socket if its already connected', () => {
      spyOn(component.socketService, 'setupSocketConnection');
      spyOn(component.socketService, 'online');
      component.socketService.socket.connected = true;
      component.connectToSocket();
      expect(
        component.socketService.setupSocketConnection
      ).not.toHaveBeenCalled();
      expect(component.socketService.online).not.toHaveBeenCalled();
    });
  });

  describe('isConnectedToSocket()', () => {
    it('should return true if user is connected to the web socket', () => {
      component.socketService.socket.connected = true;
      expect(component.isConnectedToSocket()).toBe(true);
    });

    it("should return false if user isn't connected to the web socket", () => {
      component.socketService.socket.connected = false;
      expect(component.isConnectedToSocket()).toBe(false);
    });
  });

  describe('navigate()', () => {
    it('should navigate to the specified post id', () => {
      let mockPostID = '5';
      spyOn(component.router, 'navigate');
      component.navigate(mockPostID);
      expect(component.router.navigate).toHaveBeenCalledWith([
        'notified-post',
        mockPostID,
      ]);
    });
  });

  describe('getNotifications()', () => {
    it('should get all notifications of the user when opening the list', () => {
      let mockNotifications: Notification[] = [
        {
          belongsTo: '',
          about_what: '',
          sender: [],
          happenedAt: '',
          type: '',
          postID: '',
        },
      ];
      component.getNotifications();
      const req = httpMock.expectOne(
        API_URL +
          `/api/notifications/getAllNotifications/${component.account._id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockNotifications);
      expect(component.notifications).toBe(mockNotifications);
    });
  });

  describe('toggleNotificationMenu()', () => {
    it('should toggle the notification menu and fetch notifications if its opened', () => {
      spyOn(component, 'getNotifications');
      component.notificationsMenuOpened = false;
      component.toggleNotificationMenu();
      expect(component.getNotifications).toHaveBeenCalled();
      expect(component.numOfNotifications).toBe(0);
    });
  });

  describe('logOut()', () => {
    it('should toggle the notification menu and fetch notifications if its opened', () => {
      spyOn(component.router, 'navigateByUrl');
      spyOn(component.socketService, 'disconnect');
      component.logOut();
      const token = localStorage.getItem('token');
      expect(token).toBeFalsy();
      expect(component.socketService.disconnect).toHaveBeenCalled();
      expect(component.router.navigateByUrl).toHaveBeenCalledWith('/signup');
    });
  });
});
