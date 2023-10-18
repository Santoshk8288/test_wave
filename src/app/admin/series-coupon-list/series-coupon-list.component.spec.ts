import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesCouponListComponent } from './series-coupon-list.component';

describe('SeriesCouponListComponent', () => {
  let component: SeriesCouponListComponent;
  let fixture: ComponentFixture<SeriesCouponListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesCouponListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesCouponListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
