import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { IaService } from './ia.service';

describe('IaService', () => {
  let service: IaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(IaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to /api/gerarReflexao with the given verse', () => {
    const versiculo = 'Joao 3:16';
    const mockResponse = { texto: 'reflexao gerada' };

    service.gerarReflexao(versiculo).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/gerarReflexao')
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ versiculo });
    req.flush(mockResponse);
  });
});
