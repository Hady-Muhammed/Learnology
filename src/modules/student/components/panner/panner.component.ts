import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-panner',
  templateUrl: './panner.component.html',
  styleUrls: ['./panner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PannerComponent implements OnInit {
  @Input() title!: string
  constructor() { }

  ngOnInit(): void {
  }

}
