import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonInviteeListComponent } from './non-invitee-list.component';

describe('NonInviteeListComponent', () => {
  let component: NonInviteeListComponent;
  let fixture: ComponentFixture<NonInviteeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonInviteeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonInviteeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
