import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAuthorizationsListComponent } from './hr-authorizations-list.component';

describe('HrAuthorizationsListComponent', () => {
  let component: HrAuthorizationsListComponent;
  let fixture: ComponentFixture<HrAuthorizationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrAuthorizationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrAuthorizationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
