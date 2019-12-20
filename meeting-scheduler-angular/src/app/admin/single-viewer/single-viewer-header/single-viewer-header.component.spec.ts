import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleViewerHeaderComponent } from './single-viewer-header.component';

describe('SingleViewerHeaderComponent', () => {
  let component: SingleViewerHeaderComponent;
  let fixture: ComponentFixture<SingleViewerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleViewerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleViewerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
