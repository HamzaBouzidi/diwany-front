import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrVacationsListComponent } from './hr-vacations-list.component';

describe('HrVacationsListComponent', () => {
  let component: HrVacationsListComponent;
  let fixture: ComponentFixture<HrVacationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrVacationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrVacationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
