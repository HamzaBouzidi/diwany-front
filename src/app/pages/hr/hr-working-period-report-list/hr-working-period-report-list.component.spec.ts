import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrWorkingPeriodReportListComponent } from './hr-working-period-report-list.component';

describe('HrWorkingPeriodReportListComponent', () => {
  let component: HrWorkingPeriodReportListComponent;
  let fixture: ComponentFixture<HrWorkingPeriodReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrWorkingPeriodReportListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrWorkingPeriodReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
