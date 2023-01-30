import { API_URL } from './../../../../app/services/socketio.service';
import { Teacher } from './../../../../app/models/teacher';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-navbarr',
  templateUrl: './navbarr.component.html',
  styleUrls: ['./navbarr.component.css'],
})
export class NavbarrComponent implements OnInit {
  account!: Teacher;
  @Input() toggle!: boolean;
  constructor(private router: Router, private http: HttpClient) {}
  ngOnInit(): void {
    this.getAccount();
  }
  logOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signup');
  }
  getAccount() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
      });
  }
}
