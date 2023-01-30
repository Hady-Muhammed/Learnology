import { API_URL } from './../../../../services/socketio.service';
import { Quiz } from './../../../../models/quiz';
import { Student } from './../../../../models/student';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-taken-exams',
  templateUrl: './taken-exams.component.html',
  styleUrls: ['./taken-exams.component.css']
})
export class TakenExamsComponent implements OnInit {
  account!: Student
  quizzes!: Quiz[]
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getAccount()
  }
  getQuizzes(){
    let quizIDs = []
    for (let i = 0; i < this.account.taken_quizzes.length; i++) {
      quizIDs[i] = this.account.taken_quizzes[i].id;
    }
    this.http.post<Quiz[]>(API_URL+'/api/quizzes/getQuizzesByIds',
    {
      quizIDs,
    }).subscribe((quizzes: Quiz[]) => {
      console.log(quizzes)
      this.quizzes = quizzes
    })
  }
  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL+`/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.getQuizzes()
      });
  }
}