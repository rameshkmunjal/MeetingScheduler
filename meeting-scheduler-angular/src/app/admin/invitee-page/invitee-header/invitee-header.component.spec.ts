import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteeHeaderComponent } from './invitee-header.component';

describe('InviteeHeaderComponent', () => {
  let component: InviteeHeaderComponent;
  let fixture: ComponentFixture<InviteeHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteeHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
