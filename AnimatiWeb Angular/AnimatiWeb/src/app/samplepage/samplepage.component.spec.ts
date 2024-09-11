import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplepageComponent } from './samplepage.component';

describe('SamplepageComponent', () => {
  let component: SamplepageComponent;
  let fixture: ComponentFixture<SamplepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplepageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SamplepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
