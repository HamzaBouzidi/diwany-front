import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorisationRequestComponent } from './autorisation-request.component';

describe('AutorisationRequestComponent', () => {
  let component: AutorisationRequestComponent;
  let fixture: ComponentFixture<AutorisationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorisationRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutorisationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
