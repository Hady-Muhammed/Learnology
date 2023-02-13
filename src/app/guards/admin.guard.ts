import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let token = JSON.parse(localStorage.getItem('token') || '');
    if (token) {
      if (token?.email === 'admin@gmail.com' && token?.password === 'admin') {
        return true;
      }
    }
    this.router.navigate(['/signin']);
    return false;
  }
}
