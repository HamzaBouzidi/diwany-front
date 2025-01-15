import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalIdentityCardComponent } from './national-identity-card.component';

describe('NationalIdentityCardComponent', () => {
  let component: NationalIdentityCardComponent;
  let fixture: ComponentFixture<NationalIdentityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NationalIdentityCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NationalIdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
