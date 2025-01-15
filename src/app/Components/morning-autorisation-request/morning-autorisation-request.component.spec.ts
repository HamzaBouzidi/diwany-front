import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorningAutorisationRequestComponent } from './morning-autorisation-request.component';

describe('MorningAutorisationRequestComponent', () => {
  let component: MorningAutorisationRequestComponent;
  let fixture: ComponentFixture<MorningAutorisationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorningAutorisationRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MorningAutorisationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
