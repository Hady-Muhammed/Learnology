import { API_URL } from './../../../../../app/services/socketio.service';
import { Teacher } from './../../../../../app/models/teacher';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import jwtDecode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-create-article',
  templateUrl: './teacher-create-article.component.html',
  styleUrls: ['./teacher-create-article.component.css'],
})
export class TeacherCreateArticleComponent implements OnInit, OnDestroy {
  selectedValue!: any;
  account!: Teacher;
  categories: any[] = [
    { value: 'Web Development', viewValue: 'Web Development' },
    { value: 'Frontend', viewValue: 'Frontend' },
    { value: 'Data Science', viewValue: 'Data Science' },
    { value: 'JavaScript Hacks', viewValue: 'JavaScript Hacks' },
    { value: 'Python Programmming', viewValue: 'Python Programmming' },
  ];
  title = new FormControl('', [Validators.required]);
  imageURL = new FormControl('', [Validators.required]);
  articleContent = new FormControl('', [Validators.required]);
  subscription!: Subscription;

  constructor(
    private http: HttpClient,
    public toast: NgToastService,
    public router: Router
  ) {
    this.getAccount();
  }

  ngOnInit(): void {}

  return(): void {
    window.history.back();
  }

  publishArticle(): void {
    if (
      this.title.value &&
      this.imageURL.value &&
      this.selectedValue &&
      this.articleContent.value
    ) {
      const sub = this.http
        .post(API_URL + '/api/articles/publishArticle', {
          author: this.account.name,
          title: this.title.value,
          image: this.imageURL.value,
          postedAt: new Date().toUTCString(),
          category: this.selectedValue,
          body: this.articleContent.value,
        })
        .subscribe({
          next: (res: any) => {
            this.toast.success({ detail: 'Article published successfully!' });
            this.http
              .post(API_URL + '/api/articles/addArticleToTeacher', {
                id: res.id,
                email: this.account.email,
              })
              .subscribe((res) => {
                this.router.navigateByUrl('/teacher/articles');
              });
          },
          error: (res) => {
            this.toast.error({ detail: 'error!!' });
          },
        });
      this.subscription?.add(sub);
    } else {
      this.toast.error({ detail: "Enter a valid article's data" });
    }
  }

  getAccount(): void {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
