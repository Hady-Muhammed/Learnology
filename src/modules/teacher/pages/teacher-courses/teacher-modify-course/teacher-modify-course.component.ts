import { API_URL } from './../../../../../app/services/socketio.service';
import { Student } from './../../../../../app/models/student';
import { Course } from './../../../../../app/models/course';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Teacher } from 'src/app/models/teacher';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-teacher-modify-course',
  templateUrl: './teacher-modify-course.component.html',
  styleUrls: ['./teacher-modify-course.component.css'],
})
export class TeacherModifyCourseComponent implements OnInit , AfterViewInit {
  account!: Teacher;
  form: any;
  id!: string;
  course!: Course;
  dataSource!: MatTableDataSource<Student>;
  displayedColumns: string[] = ['id', 'photo' , 'name', 'email', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private toast: NgToastService,
    private router: Router,
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
  }
  /* FormGroup Fields Getters */
  get courseTitle() {
    return this.form.get('courseTitle');
  }
  get WhatYouWillLearn() : FormArray {
    return this.form.get("WhatYouWillLearn") as FormArray
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

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getAccount();
  }
  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  return() {
    window.history.back();
  }
  getAccount() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    console.log(teacher);
    this.http
      .get<Teacher>(
        API_URL + `/api/teachers/getTeacher/${teacher.email}`
      )
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        let courseID = teacher.courses_teaching.find((crs) => crs === this.id);
        this.http
          .get<Course>(API_URL + `/api/courses/getCourse/${courseID}`)
          .subscribe((course: Course) =>{
            this.course = course;
            this.getOriginalData(course)
            this.getEnrolledStudents(course.enrolled_students)
            });
      });
  }

  getOriginalData(course: Course){
    this.courseCateg.setValue(course.category)
    this.courseOverview.setValue(course.overview)
    this.courseTitle.setValue(course.course_title)
    this.coursePrice.setValue(course.price)
    this.courseShortDesc.setValue(course.short_desc)
    this.coursePostedAt.setValue(course.postedAt)
    this.imageURL.setValue(course.image)
    for (let i = 0; i < course.WhatYouWillLearn.length; i++) {
      this.addOldPoints(course.WhatYouWillLearn[i])
    }
  }

  addOldPoints(point: string){
    this.WhatYouWillLearn.push(this.point(point))
  }

  point(point: string): FormGroup {
    return this.fb.group({
      point,
    })
  }

  addNewPoint(){
    this.WhatYouWillLearn.push(this.fb.group({
      point: '',
    }))
  }

  deletePoint(index: number){
    this.WhatYouWillLearn.removeAt(index)
    this.WhatYouWillLearn.markAsTouched()
  }

  saveChanges(){
    let points = this.WhatYouWillLearn.value.map((x: any) => x.point)
    let modifiedCourse = {
      course_title: this.courseTitle.value,
      short_desc: this.courseShortDesc.value,
      image: this.imageURL.value,
      postedAt: this.coursePostedAt.value,
      category: this.courseCateg.value,
      overview: this.courseOverview.value,
      price: this.coursePrice.value,
      WhatYouWillLearn: points,
    }
    console.log(modifiedCourse)
    this.http.post(API_URL + '/api/courses/modifyCourse' , {
      id: this.id,
      modifiedCourse
    }).subscribe({
      next: (res:any) => {
        this.toast.success({detail: res.message})
        this.return()
      },
      error: (res:any) => {
        this.toast.error({detail: res.message})
      }
    })
  }

  cancelChanges(){
    this.form.reset()
    this.getOriginalData(this.course)
    this.WhatYouWillLearn.clear()
    for (let i = 0; i < this.course.WhatYouWillLearn.length; i++) {
      this.addOldPoints(this.course.WhatYouWillLearn[i])
    }
  }

  getEnrolledStudents(students: string[]){
    this.http.post<Student[]>(API_URL + '/api/students/getStudentsByIds',
    {
      students
    }).subscribe({
      next: (students: Student[])=>{
        console.log(students)
        // Assign data to table
        this.dataSource = new MatTableDataSource(students);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createChat(email: string , name: string , picture: string) {
        this.http
          .post(API_URL + '/api/chats/createChat', {
            chat: {
              person1: {
                picture:
                  this.account.picture,
                name: this.account.name,
                email: this.account.email,
              },
              person2: {
                picture,
                name,
                email,
              },
              newMessages: 0,
              messages: [],
            },
          }).subscribe((res:any) => {
            if (res.message === 'Chat already exists') {
              console.log(res);
              this.router.navigateByUrl(`/teacher/messages/${res.id}`);
            } else {
              console.log(res);
              this.router.navigateByUrl(`/teacher/messages/${res.id}`);
            }
          })
  }

}
