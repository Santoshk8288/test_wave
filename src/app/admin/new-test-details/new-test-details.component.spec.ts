import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTestDetailsComponent } from './new-test-details.component';
describe('NewTestDetailsComponent', () => {
    let component: NewTestDetailsComponent;
    let fixture: ComponentFixture < NewTestDetailsComponent > ;

    beforeEach(async (() => {
        TestBed.configureTestingModule({
                declarations: [NewTestDetailsComponent]
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewTestDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});