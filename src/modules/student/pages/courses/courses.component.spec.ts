import { API_URL } from 'src/app/services/socketio.service';
import { Course } from 'src/app/models/course';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CoursesComponent } from './courses.component';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let httpMock: HttpTestingController;
  const mockCourses: Course[] = [
    {
      _id: '1',
      instructor_name: 'John Doe',
      instructor_title: 'Professor',
      course_title: 'Test Course 1',
      short_desc: 'Test course description 1',
      image: 'test-course-1.jpg',
      postedAt: '2022-03-20',
      category: 'Test Category 1',
      overview: 'Test course overview 1',
      num_of_likes: 10,
      enrolled_students: ['student1', 'student2'],
      videos: [],
      rating: [],
      price: 50,
      WhatYouWillLearn: ['Learn topic 1', 'Learn topic 2'],
    },
    {
      _id: '2',
      instructor_name: 'Jane Smith',
      instructor_title: 'Professor',
      course_title: 'Test Course 2',
      short_desc: 'Test course description 2',
      image: 'test-course-2.jpg',
      postedAt: '2022-03-21',
      category: 'Test Category 2',
      overview: 'Test course overview 2',
      num_of_likes: 5,
      enrolled_students: ['student3', 'student4'],
      videos: [],
      rating: [],
      price: 75,
      WhatYouWillLearn: ['Learn topic 3', 'Learn topic 4'],
    },
    {
      _id: '3',
      instructor_name: 'Bob Johnson',
      instructor_title: 'Professor',
      course_title: 'Test Course 3',
      short_desc: 'Test course description 3',
      image: 'test-course-3.jpg',
      postedAt: '2022-03-22',
      category: 'Test Category 3',
      overview: 'Test course overview 3',
      num_of_likes: 20,
      enrolled_students: ['student5', 'student6'],
      videos: [],
      rating: [],
      price: 100,
      WhatYouWillLearn: ['Learn topic 5', 'Learn topic 6'],
    },
  ];
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [CoursesComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    component.courses = mockCourses;
    // Constructor requests
    const req = httpMock.expectOne(API_URL + '/api/courses/getAllCourses');
    req.flush(mockCourses);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filterData()', () => {
    it('should filter courses based on search term', () => {
      component.searchTerm.setValue('test');
      component.filterData();
      console.log(component.filteredCourses);
      expect(component.filteredCourses).toEqual(mockCourses);

      component.searchTerm.setValue('does not exist');
      component.filterData();
      expect(component.filteredCourses).toEqual([]);
    });

    it('should not filter courses if search term is empty', () => {
      component.searchTerm.setValue('');
      component.filterData();
      expect(component.filteredCourses).toEqual(mockCourses);
    });
  });
});
