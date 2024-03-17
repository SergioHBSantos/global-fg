import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LocationTaxService } from './location-tax.service';
import { ILocationTax } from '../model/location-tax';

describe('LocationTaxService', () => {
  let service: LocationTaxService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationTaxService],
    });

    service = TestBed.inject(LocationTaxService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch location tax rates', () => {
    const mockData: ILocationTax[] = [
      {
        location: 'Austria',
        taxRates: [10, 13, 20],
      },
      {
        location: 'Belgium',
        taxRates: [6, 12, 21],
      },
    ];

    service.getLocationsTaxRates().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tax/list');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should calculate values', () => {
    const mockData = {
      netAmount: 100,
      vatAmount: 20,
      grossAmount: 120,
      vatRate: 20,
    };
    const formData = new FormData();
    formData.append('location', 'New York');
    formData.append('netAmount', '100');
    formData.append('vatRate', '20');

    service.calculateValues(formData).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tax/calc');
    expect(req.request.method).toBe('POST');
    req.flush(mockData);
  });
});
