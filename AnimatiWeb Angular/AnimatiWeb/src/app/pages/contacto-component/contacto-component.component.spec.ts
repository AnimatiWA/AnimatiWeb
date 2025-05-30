import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ContactoComponentComponent } from './contacto-component.component';

describe('ContactoComponentComponent', () => {
  let component: ContactoComponentComponent;
  let fixture: ComponentFixture<ContactoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactoComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
