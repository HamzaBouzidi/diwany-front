import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortVacationRequestComponent } from './short-vacation-request.component';


describe('ShortVacationRequestComponent', () => {
  let component: ShortVacationRequestComponent;
  let fixture: ComponentFixture<ShortVacationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortVacationRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShortVacationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
