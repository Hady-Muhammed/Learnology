import jwtDecode from 'jwt-decode';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Quiz, question } from 'src/app/models/quiz';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.css'],
})
export class QuizDetailComponent implements OnInit {
  quiz!: Quiz;
  id!: string;
  account!: Student;
  math = Math;
  totalTime: number = 0;
  taken: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    public toast: NgToastService
  ) {
    window.scrollTo(0, 0);
    this.id = this.route.snapshot.params['id'];
    this.getQuiz(this.id);
    this.quizWasTakenBefore();
  }

  ngOnInit(): void {}

  getQuiz(id: string) {
    this.http
      .get<Quiz>(API_URL + `/api/quizzes/getSingleQuiz/${id}`)
      .subscribe((quiz: Quiz) => {
        this.quiz = quiz;
        this.totalTime = this.calcTotalTimeOfQuiz(quiz.questions)
      });
  }

  calcTotalTimeOfQuiz(questions: question[]) {
    let sum = 0
    questions.forEach((q) => {
          let arr = q.solving_time.split(':');
          let time = +arr[0] * 60 + +arr[1];
          sum += time;
        });
    return sum
  }

  takeQuiz() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .post(API_URL + `/api/students/takeQuiz`, {
        email: student.email,
        quizID: this.id,
      })
      .subscribe((res) => {});
  }

  quizWasTakenBefore() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        for (const quiz of this.account.taken_quizzes) {
          if (quiz.id == this.id) this.taken = true;
        }
      });
  }
}
