import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberNominationFormComponent } from './member-nomination-form.component';

describe('MemberNominationFormComponent', () => {
  let component: MemberNominationFormComponent;
  let fixture: ComponentFixture<MemberNominationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberNominationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberNominationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
