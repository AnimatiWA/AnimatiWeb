import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubecraftCityComponent } from './cubecraft-city.component';

describe('CubecraftCityComponent', () => {
  let component: CubecraftCityComponent;
  let fixture: ComponentFixture<CubecraftCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CubecraftCityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CubecraftCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
