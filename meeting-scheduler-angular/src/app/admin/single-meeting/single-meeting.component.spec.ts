import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMeetingComponent } from './single-meeting.component';

describe('SingleMeetingComponent', () => {
  let component: SingleMeetingComponent;
  let fixture: ComponentFixture<SingleMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
