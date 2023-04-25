import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class StudentGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');
    if (token) {
      const {role}: any = jwtDecode(token)
      if(role === "student") {
        return true
      } else if(role === "teacher") {
        this.router.navigateByUrl('/teacher');
        return false
      }
    }
    this.router.navigateByUrl('/signin');
    return false;
  }
}
