import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockModalComponent } from './block-modal.component';

describe('BlockModalComponent', () => {
  let component: BlockModalComponent;
  let fixture: ComponentFixture<BlockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
