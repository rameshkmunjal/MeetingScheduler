import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleViewerComponent } from './single-viewer.component';

describe('SingleViewerComponent', () => {
  let component: SingleViewerComponent;
  let fixture: ComponentFixture<SingleViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
