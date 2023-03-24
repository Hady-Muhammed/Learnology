import { Post } from 'src/app/models/post';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsComponent } from './posts.component';
import { Student } from 'src/app/models/student';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let httpMock: HttpTestingController
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
  let mockPosts: Post[] = [{
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
  }]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PostsComponent ]
    })
    .compileComponents();
    localStorage.setItem("token",token)
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController)
    // Constructor requests
    const req1 = httpMock.expectOne(API_URL + `/api/students/getStudent/${mockStudent.email}`)
    req1.flush(mockStudent)
    const req2 = httpMock.expectOne(API_URL + `/api/posts/getPostsOfAStudent/${component.account._id}`)
    req2.flush(mockPosts)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('refresh()', () => {
    it('should refresh the posts if react has occurred', () => {
      spyOn(component,'getMyPosts')
      component.refresh(true)
      expect(component.getMyPosts).toHaveBeenCalled();
    });
  });

});
