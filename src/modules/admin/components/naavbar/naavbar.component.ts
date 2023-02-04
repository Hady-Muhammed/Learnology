import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-naavbar',
  templateUrl: './naavbar.component.html',
  styleUrls: ['./naavbar.component.css']
})
export class NaavbarComponent implements OnInit {
  opened: boolean = true
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signup');
  }

}
