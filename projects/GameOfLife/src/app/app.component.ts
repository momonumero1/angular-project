import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gol-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'GameOfLife';
}
