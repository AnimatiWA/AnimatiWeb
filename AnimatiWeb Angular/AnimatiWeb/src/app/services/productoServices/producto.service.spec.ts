import { TestBed } from '@angular/core/testing';

import { ProductService } from './producto.service';

describe('ProductoService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
