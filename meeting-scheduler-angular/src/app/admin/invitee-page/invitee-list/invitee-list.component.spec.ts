import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteeListComponent } from './invitee-list.component';

describe('InviteeListComponent', () => {
  let component: InviteeListComponent;
  let fixture: ComponentFixture<InviteeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
