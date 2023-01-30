import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  toggle: boolean = false;
  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
  }

}
