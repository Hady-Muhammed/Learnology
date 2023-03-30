import { NgToastService } from 'ng-angular-popup';
import { API_URL } from './../../../../app/services/socketio.service';
import { Quiz } from './../../../../app/models/quiz';
import { Teacher } from 'src/app/models/teacher';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-quizzes',
  templateUrl: './teacher-quizzes.component.html',
  styleUrls: ['./teacher-quizzes.component.css'],
})
export class TeacherQuizzesComponent implements OnInit, OnDestroy {
  account!: Teacher;
  quizzes!: Quiz[];
  subscription!: Subscription;

  constructor(private http: HttpClient, public toast: NgToastService) {
    this.getAccount();
  }

  ngOnInit(): void {}

  getQuizzes(): void {
    const sub = this.http
      .get<Quiz[]>(
        API_URL + `/api/quizzes/getTeacherQuizzes/${this.account._id}`
      )
      .subscribe((quizzes: Quiz[]) => (this.quizzes = quizzes));
    this.subscription?.add(sub);
  }

  getAccount(): void {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.getQuizzes();
      });
    this.subscription?.add(sub);
  }

  deleteQuiz(id: string): void {
    const sub = this.http
      .post(API_URL + '/api/quizzes/deleteQuiz', {
        id,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getQuizzes();
        },
        error: (err) => this.toast.error({ detail: err.message }),
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
