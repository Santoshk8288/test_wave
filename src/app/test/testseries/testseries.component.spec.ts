import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestseriesComponent } from './testseries.component';

describe('TestseriesComponent', () => {
  let component: TestseriesComponent;
  let fixture: ComponentFixture<TestseriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestseriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
