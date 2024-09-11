import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeparadoresComponent } from './separadores.component';

describe('SeparadoresComponent', () => {
  let component: SeparadoresComponent;
  let fixture: ComponentFixture<SeparadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeparadoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeparadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
