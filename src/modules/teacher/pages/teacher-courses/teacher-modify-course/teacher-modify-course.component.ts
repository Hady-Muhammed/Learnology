import { API_URL } from './../../../../../app/services/socketio.service';
import { Student } from './../../../../../app/models/student';
import { Course } from './../../../../../app/models/course';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Teacher } from 'src/app/models/teacher';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-modify-course',
  templateUrl: './teacher-modify-course.component.html',
  styleUrls: ['./teacher-modify-course.component.css'],
})
export class TeacherModifyCourseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  account!: Teacher;
  form: any;
  id!: string;
  course!: Course;
  dataSource!: MatTableDataSource<Student>;
  displayedColumns: string[] = ['id', 'photo', 'name', 'email', 'action'];
  subscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private http: HttpClient,
    public toast: NgToastService,
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      courseTitle: ['', Validators.required],
      courseCateg: ['', Validators.required],
      courseShortDesc: ['', Validators.required],
      courseOverview: ['', Validators.required],
      coursePrice: ['', Validators.required],
      imageURL: ['', Validators.required],
      WhatYouWillLearn: this.fb.array([]),
      coursePostedAt: ['', Validators.required],
    });
    this.id = this.route.snapshot.params['id'];
    this.getAccount();
  }
  /* FormGroup Fields Getters */
  get courseTitle() {
    return this.form.get('courseTitle');
  }
  get WhatYouWillLearn(): FormArray {
    return this.form.get('WhatYouWillLearn') as FormArray;
  }
  get courseCateg() {
    return this.form.get('courseCateg');
  }

  get imageURL() {
    return this.form.get('imageURL');
  }

  get courseShortDesc() {
    return this.form.get('courseShortDesc');
  }

  get courseOverview() {
    return this.form.get('courseOverview');
  }

  get coursePrice() {
    return this.form.get('coursePrice');
  }
  get coursePostedAt() {
    return this.form.get('coursePostedAt');
  }
  /* FormGroup Fields Getters */

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  return() {
    window.history.back();
  }

  getAccount(): void {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);

    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        let courseID = teacher.courses_teaching.find((crs) => crs === this.id);
        const sub = this.http
          .get<Course>(API_URL + `/api/courses/getCourse/${courseID}`)
          .subscribe((course: Course) => {
            this.course = course;
            this.getOriginalData(course);
            this.getEnrolledStudents(course.enrolled_students);
          });
        this.subscription?.add(sub);
      });
    this.subscription?.add(sub);
  }

  getOriginalData(course: Course): void {
    this.courseCateg.setValue(course.category);
    this.courseOverview.setValue(course.overview);
    this.courseTitle.setValue(course.course_title);
    this.coursePrice.setValue(course.price);
    this.courseShortDesc.setValue(course.short_desc);
    this.coursePostedAt.setValue(course.postedAt);
    this.imageURL.setValue(course.image);
    for (let i = 0; i < course.WhatYouWillLearn.length; i++) {
      this.addOldPoints(course.WhatYouWillLearn[i]);
    }
  }

  addOldPoints(point: string): void {
    this.WhatYouWillLearn.push(this.point(point));
  }

  point(point: string): FormGroup {
    return this.fb.group({
      point,
    });
  }

  addNewPoint(): void {
    this.WhatYouWillLearn.push(
      this.fb.group({
        point: '',
      })
    );
  }

  deletePoint(index: number): void {
    this.WhatYouWillLearn.removeAt(index);
    this.WhatYouWillLearn.markAsTouched();
  }

  saveChanges(): void {
    let points = this.WhatYouWillLearn.value.map((x: any) => x.point);
    let modifiedCourse = {
      course_title: this.courseTitle.value,
      short_desc: this.courseShortDesc.value,
      image: this.imageURL.value,
      postedAt: this.coursePostedAt.value,
      category: this.courseCateg.value,
      overview: this.courseOverview.value,
      price: this.coursePrice.value,
      WhatYouWillLearn: points,
    };

    const sub = this.http
      .post(API_URL + '/api/courses/modifyCourse', {
        id: this.id,
        modifiedCourse,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.return();
        },
        error: (res: any) => {
          this.toast.error({ detail: res.message });
        },
      });
    this.subscription?.add(sub);
  }

  cancelChanges(): void {
    this.form.reset();
    this.getOriginalData(this.course);
    this.WhatYouWillLearn.clear();
    for (let i = 0; i < this.course.WhatYouWillLearn.length; i++) {
      this.addOldPoints(this.course.WhatYouWillLearn[i]);
    }
  }

  getEnrolledStudents(students: string[]): void {
    const sub = this.http
      .post<Student[]>(API_URL + '/api/students/getStudentsByIds', {
        students,
      })
      .subscribe({
        next: (students: Student[]) => {
          // Assign data to table
          this.dataSource = new MatTableDataSource(students);
        },
      });
    this.subscription?.add(sub);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createChat(studentID: string): void {
    const sub = this.http
      .post(API_URL + '/api/chats/createChat', {
        chat: {
          person1_ID: this.account._id,
          person2_ID: studentID,
          newMessages: 0,
          messages: [],
        },
      })
      .subscribe((res: any) => {
        this.router.navigateByUrl(`/teacher/t/messages/${res.id}`);
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
