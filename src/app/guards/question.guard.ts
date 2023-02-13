import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionGuard implements CanDeactivate<any> {
  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let currentQuestionNo: number = parseInt(
      currentState.url.split('/').at(-1) || ''
    );
    let nextQuestionNo: number = parseInt(
      nextState?.url.split('/').at(-1) || ''
    );
    if (nextQuestionNo < currentQuestionNo) return false;
    return true;
  }
}
