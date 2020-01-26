import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'gol-neon-button',
  templateUrl: './neon-button.component.html',
  styleUrls: ['./neon-button.component.css']
})
export class NeonButtonComponent implements OnInit {

  @Input() selected: boolean;
  @Input() label: string;
  constructor() { }

  ngOnInit() {
  }

}
