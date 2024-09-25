import { TestBed } from '@angular/core/testing';

import { BibliaHistoricaService } from './biblia-historica.service';

describe('BibliaHistoricaService', () => {
  let service: BibliaHistoricaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliaHistoricaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
