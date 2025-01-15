import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestReportWorkingPeriodComponent } from './test-report-working-period.component';

describe('TestReportWorkingPeriodComponent', () => {
  let component: TestReportWorkingPeriodComponent;
  let fixture: ComponentFixture<TestReportWorkingPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestReportWorkingPeriodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestReportWorkingPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
