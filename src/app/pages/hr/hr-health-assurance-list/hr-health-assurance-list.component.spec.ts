import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrHealthAssuranceListComponent } from './hr-health-assurance-list.component';

describe('HrHealthAssuranceListComponent', () => {
  let component: HrHealthAssuranceListComponent;
  let fixture: ComponentFixture<HrHealthAssuranceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrHealthAssuranceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrHealthAssuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
