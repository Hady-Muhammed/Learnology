import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Quiz } from 'src/app/models/quiz';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css'],
})
export class QuizzesComponent implements OnInit , OnDestroy {
  easy: boolean = false;
  medium: boolean = false;
  hard: boolean = false;
  quizzes!: Quiz[];
  filteredQuizzes!: Quiz[];
  loading!: boolean;
  grid!: boolean;
  searchTerm!: string;
  subscription!: Subscription;

  constructor(private http: HttpClient) {
    window.scrollTo(0, 0);
    this.getAllQuizzes();
  }

  ngOnInit(): void {}

  getAllQuizzes() {
    const sub = this.http
      .get<Quiz[]>(API_URL + '/api/quizzes/getAllQuizzes')
      .subscribe((quizzes: Quiz[]) => {
        this.quizzes = quizzes;
        this.filteredQuizzes = quizzes;
      });
    this.subscription?.add(sub);
  }

  changeDifficulty() {
    this.loading = true;
    setTimeout(() => {
      this.filteredQuizzes = [];
      if (this.easy) {
        for (let i = 0; i < this.quizzes.length; i++) {
          if (this.quizzes[i].difficulty === 'Easy')
            this.filteredQuizzes.push(this.quizzes[i]);
        }
      }
      if (this.medium) {
        for (let i = 0; i < this.quizzes.length; i++) {
          if (this.quizzes[i].difficulty === 'Medium')
            this.filteredQuizzes.push(this.quizzes[i]);
        }
      }
      if (this.hard) {
        for (let i = 0; i < this.quizzes.length; i++) {
          if (this.quizzes[i].difficulty === 'Hard')
            this.filteredQuizzes.push(this.quizzes[i]);
        }
      }
      if (!this.easy && !this.medium && !this.hard) {
        this.filteredQuizzes = this.quizzes;
      }
      this.loading = false;
    }, 2000);
  }

  searchForQuiz() {
    if (this.searchTerm) {
      this.filteredQuizzes = this.quizzes.filter((q) =>
        q.name.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredQuizzes = this.quizzes;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
