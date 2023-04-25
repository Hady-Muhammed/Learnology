import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

/* Documentation */

/// This is basically an authenticattion guard for the teacher routes specifcally
export class TeacherGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');
    if (token) {
      const {role}: any = jwtDecode(token)
      if(role === "teacher") {
        return true
      } else if(role === "student") {
        this.router.navigateByUrl('/');
        return false
      }
    }
    this.router.navigateByUrl('/signin');
    return false;
  }
}
