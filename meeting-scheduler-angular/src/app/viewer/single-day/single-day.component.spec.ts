import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDayComponent } from './single-day.component';

describe('SingleDayComponent', () => {
  let component: SingleDayComponent;
  let fixture: ComponentFixture<SingleDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
