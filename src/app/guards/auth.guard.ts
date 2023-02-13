import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

/* Documentation */

/// This is basically an authenticattion guard for the all student internal routes specifcally
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');

    if (token) {
      return this.isStudent().pipe(
        map((data) => {
          if (data) {
            return true;
          } else {
            this.router.navigateByUrl('/teacher');
            return false;
          }
        })
      );
    } else {
      this.router.navigateByUrl('/signin');
      return false;
    }
  }
  isStudent() {
    return this.auth.getTeacher().pipe(
      map((data) => {
        if (data) {
          // isTeacher
          return false;
        } else {
          // isStudent
          return true;
        }
      })
    );
  }
}
