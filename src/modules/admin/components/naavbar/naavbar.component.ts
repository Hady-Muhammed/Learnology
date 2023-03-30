import { Subscription } from 'rxjs';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-naavbar',
  templateUrl: './naavbar.component.html',
  styleUrls: ['./naavbar.component.css'],
})
export class NaavbarComponent implements OnInit, OnDestroy {
  numOfUnreadEmails!: number;
  opened: boolean = true;
  subscription!: Subscription;
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllUnreadEmails();
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signup');
  }

  navigate(url: string): void {
    this.router.navigate(['admin', 'd', url]);
  }

  getAllUnreadEmails(): void {
    const sub = this.http
      .get(API_URL + '/api/emails/getAllUnreadEmails')
      .subscribe((res: any) => {
        this.numOfUnreadEmails = res.numOfUnread;
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
