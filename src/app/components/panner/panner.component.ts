import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-panner',
  templateUrl: './panner.component.html',
  styleUrls: ['./panner.component.css']
})
export class PannerComponent implements OnInit {
  @Input() title!: string
  constructor() { }

  ngOnInit(): void {
  }

}
