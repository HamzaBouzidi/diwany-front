import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgmentPledgeComponent } from './acknowledgment-pledge.component';

describe('AcknowledgmentPledgeComponent', () => {
  let component: AcknowledgmentPledgeComponent;
  let fixture: ComponentFixture<AcknowledgmentPledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcknowledgmentPledgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcknowledgmentPledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
