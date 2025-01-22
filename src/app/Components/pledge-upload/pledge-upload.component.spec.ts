import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PledgeUploadComponent } from './pledge-upload.component';

describe('PledgeUploadComponent', () => {
  let component: PledgeUploadComponent;
  let fixture: ComponentFixture<PledgeUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PledgeUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PledgeUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
