import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCalendarComponent } from './current-calendar.component';

describe('CurrentCalendarComponent', () => {
  let component: CurrentCalendarComponent;
  let fixture: ComponentFixture<CurrentCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
