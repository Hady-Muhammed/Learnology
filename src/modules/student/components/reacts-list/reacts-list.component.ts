import { Observable, isEmpty } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { react } from 'src/app/models/post';
@Component({
  selector: 'app-reacts-list',
  templateUrl: './reacts-list.component.html',
  styleUrls: ['./reacts-list.component.css']
})
export class ReactsListComponent implements OnInit {
  @Input() reacts!: Observable<react[]>
  @Input() isOpened!: boolean
  @Output() closePopup = new EventEmitter()

  constructor() {
  }

  ngOnInit(): void {
  }

}
