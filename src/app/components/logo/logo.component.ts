import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit {
  @Input() size!: number;
  @Input() color!: string;

  constructor() {
  }

  ngOnInit(): void {
  }


}
