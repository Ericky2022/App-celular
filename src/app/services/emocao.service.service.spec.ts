import { TestBed } from '@angular/core/testing';

import { EmocaoServiceService } from './emocao.service.service';

describe('EmocaoServiceService', () => {
  let service: EmocaoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmocaoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
