import { API_URL } from './../../services/socketio.service';
import { Teacher } from './../../models/teacher';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  teachers!: Teacher[];
  constructor(private http: HttpClient) {
    window.scrollTo(0,0)
    this.getAllTeachers()
  }

  ngOnInit(): void {
  }
  getAllTeachers(){
    this.http.get(API_URL+'/api/teachers/getAllTeachers')
    .subscribe((data: any) => this.teachers = data.allTeachers)

  }

}
