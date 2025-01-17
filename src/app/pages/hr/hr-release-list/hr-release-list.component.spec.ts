import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrReleaseListComponent } from './hr-release-list.component';

describe('HrReleaseListComponent', () => {
  let component: HrReleaseListComponent;
  let fixture: ComponentFixture<HrReleaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrReleaseListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrReleaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
