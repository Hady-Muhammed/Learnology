import { Quiz } from './../../../../../app/models/quiz';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.css']
})
export class QuizCardComponent implements OnInit {
  @Input('quiz') quiz!: Quiz
  constructor() { }

  ngOnInit(): void {
  }

}
