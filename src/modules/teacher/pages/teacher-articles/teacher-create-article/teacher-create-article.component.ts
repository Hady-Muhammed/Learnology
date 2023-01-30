import { Teacher } from './../../../../../app/models/teacher';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import jwtDecode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher-create-article',
  templateUrl: './teacher-create-article.component.html',
  styleUrls: ['./teacher-create-article.component.css']
})
export class TeacherCreateArticleComponent implements OnInit {
  selectedValue!: any
  account!: Teacher;
  categories: any[] = [
    {value: 'Web Development', viewValue: 'Web Development'},
    {value: 'Frontend', viewValue: 'Frontend'},
    {value: 'Data Science', viewValue: 'Data Science'},
    {value: 'JavaScript Hacks', viewValue: 'JavaScript Hacks'},
    {value: 'Python Programmming', viewValue: 'Python Programmming'},
  ];
    title = new FormControl('',[Validators.required])
    imageURL = new FormControl('',[Validators.required])
    articleContent = new FormControl('',[Validators.required])
  constructor(private http: HttpClient, private toast: NgToastService , private router: Router) {
  }

  ngOnInit(): void {
    this.getAccount()
  }
  return() {
    window.history.back()
  }

  publishArticle(){
  if(this.title.value && this.imageURL.value && this.selectedValue && this.articleContent.value){
    this.http.post('http://localhost:1234/api/articles/publishArticle',
      {
        author: this.account.name,
        title: this.title.value,
        image: this.imageURL.value,
        postedAt: new Date().toUTCString(),
        category: this.selectedValue,
        body: this.articleContent.value
      }
    ).subscribe({
      next: (res:any) => {
        console.log(res)
        this.toast.success({detail: 'Article published successfully!'})
        this.http.post('http://localhost:1234/api/articles/addArticleToTeacher', {
          id: res.id,
          email: this.account.email
        }).subscribe(res => {
          console.log(res)
          this.router.navigateByUrl("/teacher/articles")
        })
      },
      error: res => {
        console.log(res)
        this.toast.success({detail: "error!!"})
      }
    }
    )
  } else {
    this.toast.error({detail: 'Enter a valid article\'s data'})
  }
  }

  getAccount(){
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    console.log(teacher)
    this.http.get<Teacher>(`http://localhost:1234/api/teachers/getTeacher/${teacher.email}`)
    .subscribe((teacher: Teacher) => {this.account = teacher})
  }
}
