import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

    /* Documentation */

/// This is basically an authenticattion guard for the student page specifcally

export class StudentGuard implements CanActivate {
  constructor(private auth: AuthService , private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = localStorage.getItem('token');
      if(token) {
        return this.isStudent();
      }
      this.router.navigateByUrl('/signin');
      return false
  }
  isStudent() {
    return this.auth.getTeacher().pipe(
      map((teacherFound) => {
        if (teacherFound) {
          this.router.navigateByUrl('/teacher');
          return false;
        } else {
          return true;
        }
      })
    );
  }
}

