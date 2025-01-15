import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationsListComponent } from './vacations-list.component';

describe('VacationsListComponent', () => {
  let component: VacationsListComponent;
  let fixture: ComponentFixture<VacationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VacationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
