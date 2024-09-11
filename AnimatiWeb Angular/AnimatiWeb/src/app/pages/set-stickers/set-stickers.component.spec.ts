import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetStickersComponent } from './set-stickers.component';

describe('SetStickersComponent', () => {
  let component: SetStickersComponent;
  let fixture: ComponentFixture<SetStickersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetStickersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetStickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
