import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDeUsuariosComponent } from './registro-de-usuarios.component';

describe('RegistroDeUsuariosComponent', () => {
  let component: RegistroDeUsuariosComponent;
  let fixture: ComponentFixture<RegistroDeUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroDeUsuariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroDeUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
