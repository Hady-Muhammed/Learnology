import { Post } from 'src/app/models/post';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotifiedPostComponent } from './notified-post.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('NotifiedPostComponent', () => {
  let component: NotifiedPostComponent;
  let fixture: ComponentFixture<NotifiedPostComponent>;
  let mockActivatedRoute: any;
  let httpMock: HttpTestingController;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockStudent: Student = {
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
    alreadyFriend: false
  }
  let mockPost: Post = {
    _id: '',
    authorID: '',
    author: [],
    image: '',
    publishedAt: '',
    content: '',
    comments: 0,
    reacts: 0,
    postHasLikes: false,
    postHasLoves: false,
    postHasWows: false
  }

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          id: 1
        }
      },
      params: {
          subscribe: () => {},
        },
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NotifiedPostComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
    localStorage.setItem("token",token)
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(NotifiedPostComponent);
    component = fixture.componentInstance;
    const req1 = httpMock.expectOne(API_URL + `/api/students/getStudent/${mockStudent.email}`)
    req1.flush(mockStudent)
    const req2 = httpMock.expectOne(API_URL + `/api/posts/getPost/${component.id}`)
    req2.flush(mockPost)
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('refresh()', () => {
    it('should refresh the post if react has occurred', () => {
      spyOn(component,'getPost')
      component.refresh(true)
      expect(component.getPost).toHaveBeenCalled();
    });
  });

});







