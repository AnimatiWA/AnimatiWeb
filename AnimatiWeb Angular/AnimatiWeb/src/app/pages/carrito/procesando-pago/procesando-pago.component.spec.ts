import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesandoPagoComponent } from './procesando-pago.component';

describe('ProcesandoPagoComponent', () => {
  let component: ProcesandoPagoComponent;
  let fixture: ComponentFixture<ProcesandoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesandoPagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcesandoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
