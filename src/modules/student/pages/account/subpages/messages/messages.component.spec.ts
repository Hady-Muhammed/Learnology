import { MessagesComponent } from './messages.component';
import { API_URL } from './../../../../../../app/services/socketio.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inbox } from 'src/app/models/inbox';
import { Student } from 'src/app/models/student';
import { Chat } from 'src/app/models/chat';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let httpMock: HttpTestingController;
  const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockChat: Chat;
  let mockStudent: Student;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MessagesComponent],
    }).compileComponents();
    mockStudent = {
      _id: '',
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
    mockChat =  {
      _id: '',
      person1_ID: '',
      person2_ID: '',
      person1: mockStudent,
      person2: mockStudent,
      newMessages: 0,
      messages: []
    }
    localStorage.setItem("token",token)
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    const req1 = httpMock.expectOne(
      API_URL + `/api/students/getStudent/${mockStudent.email}`
    );
    req1.flush(mockStudent);
    const req2 = httpMock.expectOne(
      API_URL + `/api/chats/getChats/${mockStudent._id}`
    );
    req2.flush([]);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify()
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteChat()', () => {
    it('should delete chat with the specified id', () => {
      spyOn(component,'getChats')
      spyOn(component.toast,'success')
      component.deleteChat(mockChat._id)
      const req = httpMock.expectOne(API_URL + "/api/chats/deleteChat")
      expect(req.request.method).toBe("POST")
      let mockResponse = {message: 'success'}
      req.flush(mockResponse)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getChats).toHaveBeenCalled()
    });
  });

  describe('goToConversation()', () => {
    it('should go to the conversation of a user', () => {
      spyOn(component.router,'navigateByUrl')
      let mockChatId = '5'
      component.goToConversation(mockChatId)
      component.messages.subscribe()
      const req = httpMock.expectOne(API_URL + "/api/chats/setNewMessages")
      expect(req.request.method).toBe("POST")
      let mockResponse = {message: 'success'}
      req.flush(mockResponse)
      expect(component.router.navigateByUrl).toHaveBeenCalledOnceWith('account/messages/' + mockChatId)
    });
  });

  describe('getChats()', () => {
    it('should get all chats of a student', () => {
      component.getChats()
      const req = httpMock.expectOne(API_URL + `/api/chats/getChats/${mockStudent._id}`)
      expect(req.request.method).toBe("GET")
      req.flush([])
      expect(component.chats).toEqual([])
    });

    it('should fetch the chats from the server and transform the data', () => {
      // Mock the response from the server
      const mockChats = [
        {
          person1a: 'person1a',
          person1b: 'person1b',
          person2a: 'person2a',
          person2b: 'person2b'
        }
      ];
      const transformedChats = [
        {
          person1: 'p',
          person2: 'e'
        }
      ];

      // Call the getChats() method
      component.getChats();

      // Expect an HTTP request to be made to the API_URL
      const req = httpMock.expectOne(`${API_URL}/api/chats/getChats/${component.account._id}`);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock data
      req.flush(mockChats);

      // Expect the data to be transformed and assigned to the component's chats property
      expect(component.chats).toEqual(transformedChats);
    });
  });


});
