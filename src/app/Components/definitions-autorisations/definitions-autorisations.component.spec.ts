import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionsAutorisationsComponent } from './definitions-autorisations.component';

describe('DefinitionsAutorisationsComponent', () => {
  let component: DefinitionsAutorisationsComponent;
  let fixture: ComponentFixture<DefinitionsAutorisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinitionsAutorisationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefinitionsAutorisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
