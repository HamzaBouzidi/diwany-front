import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrWorkingPeriodReportFormComponent } from './hr-working-period-report-form.component';

describe('HrWorkingPeriodReportFormComponent', () => {
  let component: HrWorkingPeriodReportFormComponent;
  let fixture: ComponentFixture<HrWorkingPeriodReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrWorkingPeriodReportFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrWorkingPeriodReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
