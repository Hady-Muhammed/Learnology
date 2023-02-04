import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let token = JSON.parse(localStorage.getItem("token") || '')
    console.log(token)
    if(token) {
      if(token?.email === "admin@gmail.com" && token?.password === "admin") {
        return true
      }
    }
    this.router.navigate(['/signin'])
    return false;
  }

}
