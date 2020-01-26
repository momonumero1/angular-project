import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'gol-toogle-buttons',
  templateUrl: './toogle-buttons.component.html',
  styleUrls: ['./toogle-buttons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToogleButtonsComponent implements OnInit {

  private currentSelectedItem: any;
  @Input() values: any[];
  @Output() selectedItemChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() set selectedItem(val: any) {
      this.currentSelectedItem = val;
      this.selectedItemChange.emit(val);
  }

  get selectedItem(): any {
      return this.currentSelectedItem;
  }
  constructor() { }

  ngOnInit() {

  }

  isCurrentValue(val: any): boolean {
    // console.log(val);
    return val.name === this.currentSelectedItem.name;
  }
  onClickButton(val: any) {
    this.currentSelectedItem = val;
    this.selectedItemChange.emit(val);
  }
}
