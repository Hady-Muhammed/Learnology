import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ElementRef } from '@angular/core';
import { ChatComponent } from './chat.component';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { SharedModule } from 'src/modules/shared/shared.module';
import { of, Subject } from 'rxjs';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let httpMock: HttpTestingController;
  let socketService: SocketioService;
  let mockActivatedRoute: any
  let paramMapSubject: Subject<ParamMap>;
  const mockChat = {
    _id: 'chatId',
    messages: [],
    newMessages: 0,
    person1_ID: '1',
    person2_ID: '2',
    person1a: ['person1a'],
    person1b: ['person1b'],
    person2a: ['person2a'],
    person2b: ['person2b'],
  };
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockTeacher: Teacher = {
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
    last_activity: ''
  }
  let mockStudent: Student = {
    _id: '1',
    email: '',
    name: '',
    picture: '',
    password: '',
    createdAt: '',
    enrolled_courses: [],
    liked_teachers: [],
    taken_quizzes: [],
    online: false,
    last_activity: new Date().toUTCString(),
    reacts: [],
    friends: [],
    pendingRequest: false,
    friendRequest: false,
    alreadyFriend: false
  }
  beforeEach(async () => {
    paramMapSubject = new Subject<ParamMap>();
    mockActivatedRoute = {
      snapshot: {
        params: {
          id: '123'
        }
      },
      params: paramMapSubject.asObservable()
    };
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [ChatComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    localStorage.setItem('token', token);
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    socketService = TestBed.inject(SocketioService);
    // Constructor requests
    paramMapSubject.next({ id: '456' } as unknown as ParamMap);
    const req1 = httpMock.expectOne(
      `${API_URL}/api/teachers/getTeacher/${mockTeacher.email}`
    );
    req1.flush(mockTeacher);
    const req2 = httpMock.expectOne(
      `${API_URL}/api/chats/getSingleChat/${component.id}`
    );
    req2.flush([mockChat]);
    const req3 = httpMock.expectOne(
      API_URL + `/api/students/getStudentByID/${mockStudent._id}`
    );
    req3.flush(mockStudent);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getChat()', () => {
    it('should fetch chat data and transform it', () => {
      spyOn(component, 'getPerson2');
      spyOn(component, 'listenForNewMessagesRealtime');
      spyOn(component, 'listenForTyping');
      const mockPerson2: Student = {
        _id: '2',
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
      const originalChat = [
        {
          _id: '4',
          person1_ID: '1',
          person2_ID: '2',
          newMessages: 0,
          messages: [],
          person1a: [mockStudent],
          person1b: [mockStudent],
          person2a: [mockPerson2],
          person2b: [mockPerson2],
        },
      ];
      component.getChat();
      const req = httpMock.expectOne(
        API_URL + `/api/chats/getSingleChat/${component.id}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(originalChat);
      expect(component.messages).toEqual([]);
      expect(component.newMessages).toEqual(0);
      expect(component.getPerson2).toHaveBeenCalledWith(
        originalChat[0].person1_ID
      );
      expect(component.listenForNewMessagesRealtime).toHaveBeenCalled();
      expect(component.listenForTyping).toHaveBeenCalled();
    });
  });

  describe('getPerson2()', () => {
    it('should get the account of a student', () => {
      component.getPerson2(mockStudent._id);
      const req1 = httpMock.expectOne(
        API_URL + `/api/students/getStudentByID/${mockStudent._id}`
      );
      expect(req1.request.method).toBe('GET');
      req1.flush(mockStudent);
      expect(component.person2).toBe(mockStudent);
    });
  });

  describe('sendMessage()', () => {
    it('should send a message to the other person if theres a message content', () => {
      spyOn(component, 'scrollToLastMessage');
      spyOn(component.socketService, 'sendMessage');
      spyOn(component.socketService, 'typingMessage');
      spyOn(component, 'getChat');
      component.message = 'mock';
      component.sendMessage();
      const req = httpMock.expectOne(API_URL + `/api/chats/sendMessage`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
      expect(component.scrollToLastMessage).toHaveBeenCalled();
      expect(component.socketService.sendMessage).toHaveBeenCalled();
      expect(component.socketService.typingMessage).toHaveBeenCalled();
      expect(component.getChat).toHaveBeenCalled();
      expect(component.message).toBe('');
    });
  });

  // describe('listenForNewMessagesRealtime()', () => {
  //   it('should push new messages to the messages array and scroll to the last message', () => {
  //     const message = {
  //       belongsTo: '',
  //       content: '',
  //       sentAt: ''
  //     }
  //     spyOn(component, 'scrollToLastMessage');
  //     component.listenForNewMessagesRealtime();
  //     socketService.setupSocketConnection("mockEmail@gmail.com")
  //     socketService.socket.emit('receive-message', message);
  //     expect(component.messages.length).toBe(1);
  //     expect(component.messages[0]).toEqual(message);
  //     expect(component.scrollToLastMessage).toHaveBeenCalled();
  //   });
  // });

  describe('scrollToLastMessage()', () => {
    it('should scroll to the last message', () => {
      let element: ElementRef = {
        nativeElement: {
          scrollIntoView: () => {},
        },
      };
      component.lastMessage = element;
      spyOn(component.lastMessage.nativeElement, 'scrollIntoView');
      component.scrollToLastMessage();
      expect(
        component.lastMessage.nativeElement.scrollIntoView
      ).toHaveBeenCalled();
    });
  });

  // describe('listenForTyping()', () => {
  //   it('should display a typing indicator if the other person is typing (real-time)', () => {
  //     socketService.setupSocketConnection("mockemail@gmail.com")
  //     component.listenForTyping();
  //     socketService.socket.emit('listen-typing-message', true);
  //     expect(component.typing).toBeTrue()
  //   });
  // });

  describe('isTyping()', () => {
    it("should notify the other person that i'm typing (real-time)", () => {
      spyOn(component.socketService, 'typingMessage');
      component.isTyping();
      expect(component.socketService.typingMessage).toHaveBeenCalled();
    });
  });

  describe('addEmoji()', () => {
    it('Test', () => {
      let e: { emoji: { native: any } } = {
        emoji: {
          native: undefined,
        },
      };
      component.addEmoji(e);
      expect(component.isEmojiPickerVisible).toBeFalse();
    });
  });
});
