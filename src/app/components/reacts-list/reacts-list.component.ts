import { Observable, isEmpty } from 'rxjs';
import { react } from './../../models/post';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    this.reacts.subscribe(res => console.log(res))
  }

}
