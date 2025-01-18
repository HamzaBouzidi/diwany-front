import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrNominationListComponent } from './hr-nomination-list.component';

describe('HrNominationListComponent', () => {
  let component: HrNominationListComponent;
  let fixture: ComponentFixture<HrNominationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrNominationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrNominationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
