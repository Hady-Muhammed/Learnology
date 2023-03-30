import { API_URL } from './../../../../app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  quote!: any;
  subscription!: Subscription;

  constructor(private http: HttpClient) {
    this.getRandomQuote();
  }

  ngOnInit(): void {}

  getRandomQuote() {
    const sub = this.http
      .get(API_URL + '/api/teachers/getQuote')
      .subscribe((res: any) => (this.quote = res));
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
