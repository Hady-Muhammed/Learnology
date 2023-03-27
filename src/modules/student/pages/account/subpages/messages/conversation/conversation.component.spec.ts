import { message } from './../../../../../../../app/models/chat';
import { SocketioService } from './../../../../../../../app/services/socketio.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../../../../../shared/shared.module';
import { Teacher } from './../../../../../../../app/models/teacher';
import { Student } from './../../../../../../../app/models/student';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationComponent } from './conversation.component';
import { API_URL } from 'src/app/services/socketio.service';
import { ActivatedRoute } from '@angular/router';
import { ElementRef } from '@angular/core';

describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let mockActivatedRoute: any;
  let httpMock: HttpTestingController;
  let socketService: SocketioService
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
  let mockStudent: Student = {
    _id: '1',
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
      imports: [HttpClientTestingModule, SharedModule, FormsModule,BrowserAnimationsModule],
      declarations: [ConversationComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    localStorage.setItem('token', token);
    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    socketService = TestBed.inject(SocketioService)
    // Constructor requests
    const req1 = httpMock.expectOne(
      `${API_URL}/api/students/getStudent/${mockStudent.email}`
    );
    req1.flush(mockStudent);
    const req2 = httpMock.expectOne(
      `${API_URL}/api/chats/getSingleChat/${component.id}`
    );
    req2.flush([mockChat]);
    const req3 = httpMock.expectOne(
      API_URL + `/api/students/getStudentByID/${mockChat.person2_ID}`
    );
    req3.flush({ ...mockStudent, _id: '5' });
    // console.log(component.account);
    // console.log(component.person2);
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
        alreadyFriend: false
      }
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
      expect(component.getPerson2).toHaveBeenCalledWith(originalChat[0].person2_ID);
      expect(component.listenForNewMessagesRealtime).toHaveBeenCalled();
      expect(component.listenForTyping).toHaveBeenCalled();
    });
  });

  describe('getPerson2()', () => {
    it('should get the account of a teacher of the id belongs to a teacher', () => {
      let mockTeacher: Teacher = {
        _id: '23',
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
      }
      component.getPerson2(mockTeacher._id)
      const req1 = httpMock.expectOne(API_URL + `/api/students/getStudentByID/${mockTeacher._id}`)
      expect(req1.request.method).toBe("GET")
      req1.flush(null)
      const req = httpMock.expectOne(API_URL + `/api/teachers/getTeacherByID/${mockTeacher._id}`)
      expect(req.request.method).toBe("GET")
      req.flush(mockTeacher)
      expect(component.person2).toBe(mockTeacher)
    });

    it('should get the account of a student of the id belongs to a student', () => {
      let mockStudent: Student = {
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
        alreadyFriend: false
      }
      component.getPerson2(mockStudent._id)
      const req1 = httpMock.expectOne(API_URL + `/api/students/getStudentByID/${mockStudent._id}`)
      expect(req1.request.method).toBe("GET")
      req1.flush(mockStudent)
      expect(component.person2).toBe(mockStudent)
    });
  });

  describe('sendMessage()', () => {
    it('should send a message to the other person if theres a message content', () => {
      spyOn(component,'scrollToLastMessage')
      spyOn(component.socketService,'sendMessage')
      spyOn(component.socketService,'typingMessage')
      component.message = 'mock'
      component.sendMessage()
      const req = httpMock.expectOne(API_URL + `/api/chats/sendMessage`)
      expect(req.request.method).toBe("POST")
      req.flush(null)
      expect(component.scrollToLastMessage).toHaveBeenCalled()
      expect(component.socketService.sendMessage).toHaveBeenCalled()
      expect(component.socketService.typingMessage).toHaveBeenCalled()
      expect(component.message).toBe("")
    });
  });

  // describe('listenForNewMessagesRealtime()', () => {
  //   it('should push new messages to the messages array and scroll to the last message', () => {
  //     const message: message = {
  //       belongsTo: '',
  //       content: '',
  //       sentAt: ''
  //     }
  //     spyOn(component, 'scrollToLastMessage');
  //     component.listenForNewMessagesRealtime();
  //     socketService.setupSocketConnection("mockEmail@gmail.com")
  //     socketService.socket.emit('receive-message', message);
  //     expect(component.messages.length).toBe(1);
  //     expect(component.messages[0]).toBe(message);
  //     expect(component.scrollToLastMessage).toHaveBeenCalled();
  //   });
  // });

  describe('scrollToLastMessage()', () => {
    it('should scroll to the last message', () => {
      let element: ElementRef = {
        nativeElement: {
          scrollIntoView: () => {}
        }
      }
      component.lastMessage = element
      spyOn(component.lastMessage.nativeElement,'scrollIntoView')
      component.scrollToLastMessage();
      expect(component.lastMessage.nativeElement.scrollIntoView).toHaveBeenCalled();
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
    it('should notify the other person that i\'m typing (real-time)', () => {
      spyOn(component.socketService,'typingMessage')
      component.isTyping();
      expect(component.socketService.typingMessage).toHaveBeenCalled()
    });
  });

  describe('addEmoji()', () => {
    it('Test', () => {
      let e: { emoji: { native: any; }; } = {
        emoji: {
          native: undefined
        }
      }
      component.addEmoji(e)
      expect(component.isEmojiPickerVisible).toBeFalse()
    });
  });

});
