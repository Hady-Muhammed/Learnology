import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './../../../../app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chat } from 'src/app/models/chat';
import { TeacherMessagesComponent } from './teacher-messages.component';
import { API_URL } from 'src/app/services/socketio.service';
import { Teacher } from 'src/app/models/teacher';
import { SharedModule } from 'src/modules/shared/shared.module';

describe('TeacherMessagesComponent', () => {
  let component: TeacherMessagesComponent;
  let fixture: ComponentFixture<TeacherMessagesComponent>;
  let httpMock: HttpTestingController;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockChat: any;
  let mockTeacher: Teacher;
  let mockChats: any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        SharedModule,
        ReactiveFormsModule,
      ],
      declarations: [TeacherMessagesComponent],
    }).compileComponents();
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
    mockChat = {
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
    mockChats = [
      {
        _id: '431',
        messages: [],
        newMessages: 0,
        person1_ID: '1',
        person2_ID: '2',
        person1a: ['person1a'],
        person1b: ['person1b'],
        person2a: ['person2a'],
        person2b: ['person2b'],
      },
      {
        _id: '123',
        messages: [],
        newMessages: 0,
        person1_ID: '3',
        person2_ID: '4',
        person1a: ['person1a'],
        person1b: ['person1b'],
        person2a: ['person2a'],
        person2b: ['person2b'],
      },
    ];
    localStorage.setItem('token', token);
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TeacherMessagesComponent);
    component = fixture.componentInstance;
    const req1 = httpMock.expectOne(
      API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
    );
    req1.flush(mockTeacher);
    const req2 = httpMock.expectOne(
      API_URL + `/api/chats/getChats/${mockTeacher._id}`
    );
    req2.flush(mockChats);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteChat()', () => {
    it('should delete chat with the specified id', () => {
      spyOn(component, 'getChats');
      spyOn(component.toast, 'success');
      spyOn(component.router, 'navigateByUrl');
      component.deleteChat(mockChat._id);
      const req = httpMock.expectOne(API_URL + '/api/chats/deleteChat');
      expect(req.request.method).toBe('POST');
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(component.getChats).toHaveBeenCalled();
      expect(component.router.navigateByUrl).toHaveBeenCalledWith(
        'teacher/messages'
      );
      expect(component.toast.success).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.deleteChat(mockChat._id);
      const req = httpMock.expectOne(API_URL + '/api/chats/deleteChat');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('goToConversation()', () => {
    it('should go to the conversation of a user', () => {
      spyOn(component.router, 'navigateByUrl');
      let mockChatId = '5';
      component.goToConversation(mockChatId, mockChat);
      expect(component.router.navigateByUrl).toHaveBeenCalledOnceWith(
        'teacher/t/messages/' + mockChatId
      );
    });
  });

  describe('getChats()', () => {
    it('should get all chats of a teacher', () => {
      component.getChats();
      const req = httpMock.expectOne(
        API_URL + `/api/chats/getChats/${mockTeacher._id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
      expect(component.chats).toEqual([]);
    });

    it('should fetch the chats from the server and transform the data', () => {
      // Mock the response from the server
      const mockChats = [
        {
          person1a: 'person1a',
          person1b: 'person1b',
          person2a: 'person2a',
          person2b: 'person2b',
        },
      ];
      // Call the getChats() method
      component.getChats();
      // Expect an HTTP request to be made to the API_URL
      const req = httpMock.expectOne(
        `${API_URL}/api/chats/getChats/${component.account._id}`
      );
      expect(req.request.method).toEqual('GET');

      // Respond with the mock data
      req.flush(mockChats);
    });
  });

  // describe('filterData', () => {
  //   it('should filter the chats by name if theres a search term ', () => {
  //     component.searchTerm.setValue('mock');
  //     expect().toBe();
  //   });
  //   it('should not filter the chats by name if theres no search term ', () => {
  //     component.filterData();
  //     expect(component.filteredChats).toBe(mockChats);
  //   });
  // });
});
