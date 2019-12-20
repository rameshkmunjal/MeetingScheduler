import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteePageComponent } from './invitee-page.component';

describe('InviteePageComponent', () => {
  let component: InviteePageComponent;
  let fixture: ComponentFixture<InviteePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
