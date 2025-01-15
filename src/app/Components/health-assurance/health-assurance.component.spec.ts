import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthAssuranceComponent } from './health-assurance.component';

describe('HealthAssuranceComponent', () => {
  let component: HealthAssuranceComponent;
  let fixture: ComponentFixture<HealthAssuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthAssuranceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
