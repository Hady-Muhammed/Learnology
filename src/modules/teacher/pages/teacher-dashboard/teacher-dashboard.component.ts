import { API_URL } from './../../../../app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
})
export class TeacherDashboardComponent implements OnInit {
  quote!: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRandomQuote();
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
  }

  getRandomQuote() {
    this.http
      .get(API_URL + '/api/teachers/getQuote')
      .subscribe((res: any) => (this.quote = res));
  }
}
