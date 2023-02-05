import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-naavbar',
  templateUrl: './naavbar.component.html',
  styleUrls: ['./naavbar.component.css'],
})
export class NaavbarComponent implements OnInit {
  numOfUnreadEmails!: number;
  opened: boolean = true;
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllUnreadEmails()
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signup');
  }

  navigate(url: string) {
    this.router.navigate(['admin','d', url]);
  }

  getAllUnreadEmails() {
    this.http.get(API_URL + "/api/emails/getAllUnreadEmails")
    .subscribe((res: any) => {
      this.numOfUnreadEmails = res.numOfUnread;
    })
  }
}
