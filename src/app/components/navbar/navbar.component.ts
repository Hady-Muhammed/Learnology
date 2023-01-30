import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isOpened: boolean = false
  account!: any
  constructor(private http: HttpClient , private toast: NgToastService , private router: Router) {
    this.getAccount()
  }

  ngOnInit(): void {
  }
  logOut(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signup')
  }
  getAccount(){
    const token = localStorage.getItem('token') || ''
    const account: any = jwt_decode(token)
    this.http.get(API_URL+`/api/students/getStudent/${account.email}`).subscribe(
      res => {
        this.account = res
      }
    )
  }
}
