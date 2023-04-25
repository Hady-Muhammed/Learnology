import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { question, Quiz } from 'src/app/models/quiz';
import { API_URL } from 'src/app/services/socketio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  questionNo!: string;
  currentQuestion!: question;
  ans!: string;
  quiz!: Quiz;
  id!: string;
  timer!: number;
  choosenAnswer!: string;
  totalTime!: number;
  interval: any;
  subscription!: Subscription;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    public toast: NgToastService
  ) {
    this.id = this.route.snapshot.params['quizID'];
    this.questionNo = this.route.snapshot.params['qnum'];
    this.route.params.subscribe((val) => {
      this.questionNo = this.route.snapshot.params['qnum'];
      this.id = this.route.snapshot.params['quizID'];
      this.getQuiz(this.id);
    });
  }

  ngOnInit(): void {
    this.startTimer();
  }

  getQuiz(id: string): void {
    if(!this.quiz) {
      const sub = this.http
        .get<Quiz>(API_URL + `/api/quizzes/getSingleQuiz/${id}`)
        .subscribe((quiz: Quiz) => {
          this.quiz = quiz;
          this.changeQuestion()
        });
      this.subscription?.add(sub);
    } else {
      this.changeQuestion()
    }
  }

  changeQuestion(): void {
    this.currentQuestion = this.quiz.questions[+this.questionNo - 1];
    let arr = this.currentQuestion.solving_time.split(':');
    this.timer = +arr[0] * 60 + +arr[1];
    this.totalTime = this.timer;
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer-- === 0) {
        clearInterval(this.interval);
        const isLastQuestion = +this.questionNo === this.quiz.questions.length;
        const message = isLastQuestion ? 'Quiz timeout!' : 'Question timeout!';

        this.toast.warning({ detail: message });

        if (!isLastQuestion) {
          this.router.navigate(['/quiz', this.quiz._id, +this.questionNo + 1]);
        }
      }
    }, 1000);
  }

  nextQuestion(id: string, qnum: any, ans: string): void {
    if (ans) {
      let answeredQuestions = localStorage.getItem('answeredQuestions');

      if (!answeredQuestions) {
        localStorage.setItem(
          'answeredQuestions',
          JSON.stringify([
            {
              questionNo: qnum - 1,
              answer: ans,
            },
          ])
        );
      } else {
        let answeredQuestions = JSON.parse(
          localStorage.getItem('answeredQuestions') || ''
        );
        answeredQuestions.push({
          questionNo: qnum - 1,
          answer: ans,
        });
        localStorage.setItem(
          'answeredQuestions',
          JSON.stringify(answeredQuestions)
        );
      }
      this.router.navigate(['quiz', id, qnum]);
    } else {
      this.toast.error({ detail: 'Choose an answer!' });
    }
  }

  submitQuiz(ans: string): void {
    if (ans) {
      let answeredQuestions = JSON.parse(
        localStorage.getItem('answeredQuestions') || ''
      );
      answeredQuestions.push({
        questionNo: this.quiz.questions.length - 1,
        answer: ans,
      });
      localStorage.setItem(
        'answeredQuestions',
        JSON.stringify(answeredQuestions)
      );
      this.correctQuiz();
    } else {
      this.toast.error({ detail: 'Choose an answer!' });
    }
  }

  correctQuiz(): void {
    let studentAnswers = JSON.parse(
      localStorage.getItem('answeredQuestions') || ''
    );
    let correct = 0;

    for (let i = 0; i < this.quiz.questions.length; i++) {
      if (this.quiz.questions[i].correctAnswer === studentAnswers[i].answer)
        correct++;
    }

    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    const sub = this.http
      .post(API_URL + '/api/quizzes/calculateScore', {
        studentEmail: student.email,
        quizID: this.quiz._id,
        score: `${correct}/${this.quiz.questions.length}`,
      })
      .subscribe((res) => {
        this.router.navigate(['quiz-results', this.quiz._id], {
          state: { correct },
        });
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
