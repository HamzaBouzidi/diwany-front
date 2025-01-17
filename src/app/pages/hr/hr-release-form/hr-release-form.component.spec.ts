import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrReleaseFormComponent } from './hr-release-form.component';

describe('HrReleaseFormComponent', () => {
  let component: HrReleaseFormComponent;
  let fixture: ComponentFixture<HrReleaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrReleaseFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrReleaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
