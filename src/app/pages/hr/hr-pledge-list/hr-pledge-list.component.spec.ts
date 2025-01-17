import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrPledgeListComponent } from './hr-pledge-list.component';

describe('HrPledgeListComponent', () => {
  let component: HrPledgeListComponent;
  let fixture: ComponentFixture<HrPledgeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrPledgeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrPledgeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
