import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Quiz } from 'src/app/models/quiz';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css'],
})
export class QuizzesComponent implements OnInit {
  easy: boolean = false;
  medium: boolean = false;
  hard: boolean = false;
  quizzes!: Quiz[];
  filteredQuizzes!: Quiz[];
  loading!: boolean;
  grid!: boolean;
  searchTerm!: string;
  
  constructor(private http: HttpClient) {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.getAllQuizzes();
  }

  createQuiz() {
    this.http
      .post(API_URL + '/api/quizzes/createQuiz', {
        quizz: {
          name: 'The Winning Team',
          author: {
            name: 'marwa',
            id: '63b580bf517a402d4629fb0d',
          },
          publishedAt: new Date().toUTCString(),
          category: 'Data Science',
          difficulty: 'Easy',
          image:
            'https://avatars.mds.yandex.net/i?id=94eb57822638ff25bc8332b40238f788-4477047-images-thumbs&n=13',
          questions: [],
        },
      })
      .subscribe((res) => console.log(res));
  }

  getAllQuizzes() {
    this.http
      .get<Quiz[]>(API_URL + '/api/quizzes/getAllQuizzes')
      .subscribe((quizzes: Quiz[]) => {
        this.quizzes = quizzes;
        this.filteredQuizzes = quizzes;
      });
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
      console.log(this.filteredQuizzes);
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
}
