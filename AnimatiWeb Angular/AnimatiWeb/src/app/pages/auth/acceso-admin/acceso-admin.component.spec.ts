import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoAdminComponent } from './acceso-admin.component';

describe('AccesoAdminComponent', () => {
  let component: AccesoAdminComponent;
  let fixture: ComponentFixture<AccesoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesoAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccesoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
