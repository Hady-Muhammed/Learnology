import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css'],
})
export class QuizResultsComponent implements OnInit, OnDestroy {
  id!: string;
  score!: string;
  percentage!: string;
  parseIntt = parseInt;
  subscription!: Subscription;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    this.getScore();
  }

  ngOnInit(): void {}

  getScore(): void {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        for (let i = 0; i < student.taken_quizzes.length; i++)
          if (student.taken_quizzes[i].id == this.id)
            this.score = student.taken_quizzes[i].score;
        let x = this.score.split('/');
        this.percentage = `${((+x[0] / +x[1]) * 100).toFixed(1)}%`;
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
