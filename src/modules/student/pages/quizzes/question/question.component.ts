import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { question, Quiz } from 'src/app/models/quiz';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  questionNo!: string;
  currentQuestion!: question;
  ans!: string;
  quiz!: Quiz;
  id!: string;
  timer!: number;
  choosenAnswer!: string;
  totalTime!: number;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toast: NgToastService
  ) {
    this.route.params.subscribe((val) => {
      this.questionNo = this.route.snapshot.params['qnum'];
      this.id = this.route.snapshot.params['quizID'];
      this.getQuiz(this.id);
    });
  }

  ngOnInit(): void {
    this.startTimer();
  }

  getQuiz(id: string) {
    this.http
      .get<Quiz>(API_URL + `/api/quizzes/getSingleQuiz/${id}`)
      .subscribe((quiz: Quiz) => {
        this.quiz = quiz;
        this.currentQuestion = this.quiz.questions[+this.questionNo - 1];
        let arr = this.currentQuestion.solving_time.split(':');
        this.timer = +arr[0] * 60 + +arr[1];
        this.totalTime = this.timer;
      });
  }

  startTimer() {
    setInterval(() => {
      this.timer--;
      if (this.timer === 0 && +this.questionNo === this.quiz.questions.length) {
        this.toast.warning({ detail: 'Quiz timeout!' });
      } else if (this.timer === 0) {
        this.toast.warning({ detail: 'Question timeout!' });
        this.router.navigate([
          '/quiz',
          `${this.quiz._id}`,
          +this.questionNo + 1,
        ]);
      }
    }, 1000);
  }

  nextQuestion(id: string, qnum: any, ans: string) {
    if(ans){
      let answeredQuestions = localStorage.getItem('answeredQuestions')
      console.log(answeredQuestions)
      if(!answeredQuestions){
        localStorage.setItem('answeredQuestions',JSON.stringify([{
          questionNo: qnum - 1,
          answer: ans
        }]))
        this.router.navigate(['quiz', id, qnum])
      } else {
        let answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '')
        answeredQuestions.push({
          questionNo: qnum - 1,
          answer: ans
        })
        localStorage.setItem('answeredQuestions',JSON.stringify(answeredQuestions))
        this.router.navigate(['quiz', id, qnum])
      }
    }
    else {
      this.toast.error({detail: 'Choose an answer!'})
    }
  }

  submitQuiz(ans: string) {
    if(ans){
      let answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '')
      answeredQuestions.push({
        questionNo: this.quiz.questions.length - 1,
        answer: ans
      })
      localStorage.setItem('answeredQuestions',JSON.stringify(answeredQuestions))

      let studentAnswers = JSON.parse(localStorage.getItem('answeredQuestions') || '')
      let correct = 0;

      for (let i = 0; i < this.quiz.questions.length; i++) {
        if (
          this.quiz.questions[i].correctAnswer === studentAnswers[i].answer
        )
          correct++;
      }

      const token: any = localStorage.getItem('token');
      const student: any = jwtDecode(token);
      this.http
        .post(API_URL + '/api/quizzes/calculateScore', {
          studentEmail: student.email,
          quizID: this.quiz._id,
          score: `${correct}/${this.quiz.questions.length}`,
        })
        .subscribe((res) => {
          console.log(res);
          this.router.navigate(['quiz-results', this.quiz._id], {
            state: { correct },
          });
        });
    }
    else {
      this.toast.error({detail: 'Choose an answer!'})
    }
  }
}
