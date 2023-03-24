import { of } from 'rxjs';
import { routes } from './../../../../app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { API_URL } from './../../../../app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaavbarComponent } from './naavbar.component';

describe('NaavbarComponent', () => {
  let component: NaavbarComponent;
  let fixture: ComponentFixture<NaavbarComponent>;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [NaavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NaavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    spyOn(router, 'navigateByUrl');
    spyOn(router,'navigate')
  });

  describe('logOut()', () => {
    it('should remove token from local storage', () => {
      component.logOut();
      const token = localStorage.getItem('token');
      expect(token).toBeFalsy();
    });

    it('should navigate to signup page', () => {
      component.logOut();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/signup');
    });
  });

  describe('navigate()', () => {
    it('should navigate according to the url', () => {
      component.navigate("dashboard")
      expect(router.navigate).toHaveBeenCalledWith(['admin', 'd', 'dashboard'])
    });
  });

  describe('getAllUnreadEmails()', () => {
    it('should set the number of unread emails on getAllUnreadEmails()', () => {
      const mockResponse = { numOfUnread: 5 };
      spyOn(component['http'], 'get').and.returnValue(of(mockResponse));
      component.getAllUnreadEmails();
      expect(component.numOfUnreadEmails).toEqual(mockResponse.numOfUnread);
    });
  });
});
