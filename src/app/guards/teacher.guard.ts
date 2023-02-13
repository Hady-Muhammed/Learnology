import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

/* Documentation */

/// This is basically an authenticattion guard for the teacher routes specifcally
export class TeacherGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');
    if (token) {
      return this.isTeacher();
    }
    this.router.navigateByUrl('/signin');
    return false;
  }
  isTeacher() {
    return this.auth.getTeacher().pipe(
      map((teacherFound) => {
        if (teacherFound) {
          // isTeacher
          return true;
        } else {
          // isStudent
          this.router.navigateByUrl('/');
          return false;
        }
      })
    );
  }
}
