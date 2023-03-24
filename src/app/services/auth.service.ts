import { Observable } from 'rxjs';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from './socketio.service';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  getTeacher(): Observable<Teacher> {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwt_decode(token);
    return this.http.get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`);
  }
}
