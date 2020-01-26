import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToogleButtonsComponent } from './toogle-buttons.component';

describe('ToogleButtonsComponent', () => {
  let component: ToogleButtonsComponent;
  let fixture: ComponentFixture<ToogleButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToogleButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToogleButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
