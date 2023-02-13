import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css'],
})
export class QuizResultsComponent implements OnInit {
  id!: string;
  score!: string;
  percentage!: string;
  parseIntt = parseInt;
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getScore();
  }

  getScore() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        for (let i = 0; i < student.taken_quizzes.length; i++)
          if (student.taken_quizzes[i].id === this.id)
            this.score = student.taken_quizzes[i].score;
        let x = this.score.split('/');
        this.percentage = `${((+x[0] / +x[1]) * 100).toFixed(1)}%`;
      });
  }
}
