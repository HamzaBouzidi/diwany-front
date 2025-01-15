import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrNationalIdentityCardListComponent } from './hr-national-identity-card-list.component';

describe('HrNationalIdentityCardListComponent', () => {
  let component: HrNationalIdentityCardListComponent;
  let fixture: ComponentFixture<HrNationalIdentityCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrNationalIdentityCardListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrNationalIdentityCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
