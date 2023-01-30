import { API_URL } from './../../../../../app/services/socketio.service';
import { Teacher } from './../../../../../app/models/teacher';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-teacher-create-course',
  templateUrl: './teacher-create-course.component.html',
  styleUrls: ['./teacher-create-course.component.css']
})
export class TeacherCreateCourseComponent implements OnInit {

  selectedValue!: any
  account!: Teacher;
  form: any;
  constructor(private http: HttpClient, private toast: NgToastService , private router: Router , private fb: FormBuilder) {
    this.form = this.fb.group({
      courseTitle: ['', Validators.required],
      courseCateg: ['', Validators.required],
      courseShortDesc: ['', Validators.required],
      courseOverview: ['', Validators.required],
      coursePrice: ['', Validators.required],
      imageURL: ['', Validators.required],
    })
  }
  /* FormGroup Fields Getters */
  get courseTitle() {
    return this.form.get('courseTitle');
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

  /* FormGroup Fields Getters */

  ngOnInit(): void {
    this.getAccount()
  }
  return() {
    window.history.back()
  }
  getAccount(){
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    console.log(teacher)
    this.http.get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
    .subscribe((teacher: Teacher) => {this.account = teacher})
  }
  publishCourse(){
    if(this.form.status === 'VALID'){
      this.http.post(API_URL + '/api/courses/publishCourse',
      {
        coursee: {
          instructor_name: this.account.name,
          instructor_title: this.account.title,
          course_title: this.courseTitle.value,
          short_desc: this.courseShortDesc.value,
          image: this.imageURL.value,
          postedAt: new Date().toUTCString(),
          num_of_likes: 0,
          rating: [1,1,1],
          overview: this.courseOverview.value,
          category: this.courseCateg.value,
          price: this.coursePrice.value,
          WhatYouWillLearn: [],
          videos: []
        },
        email: this.account.email
      }).subscribe({
        next: (res:any) => {
          console.log(res)
          this.toast.success({detail: 'Course published successfully!'})
          this.router.navigateByUrl("/teacher/courses")
        },
        error: res => {
          console.log(res)
          this.toast.success({detail: "error!!"})
        }
      })
    } else {
      this.toast.error({detail: 'Enter valid data'})
    }
  }
}
