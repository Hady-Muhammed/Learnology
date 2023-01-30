import { Teacher } from 'src/app/models/teacher';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher-card',
  templateUrl: './teacher-card.component.html',
  styleUrls: ['./teacher-card.component.css']
})
export class TeacherCardComponent implements OnInit {
  @Input("teacher") teacher!: Teacher
  constructor() { }

  ngOnInit(): void {
  }

}
